const iputils=require("ip-utils")
const assert=require("assert")
const fs=require("fs")
const deepMerge=require("deep-extend")
const shell=require("shelljs")
const path=require("path")

class NetworkConfigurator {
    constructor(interfaceFile) {
        this.interfaceFile=interfaceFile || '/etc/network/interfaces'
        this._validInterfaces=[]
    }

    /**
     * 由于本类是通过读取'/etc/network/interfaces'来进行工作的
     * 因此'/etc/network/interfaces'文件如果不存在则不能工作
     */
    get ready(){
        return fs.existsSync(this.interfaceFile)
    }
    /**
     * 设置有效的接口名称
     * 只允许配置在硬件规格中存在的接口名称
     *
     *
     */
    setValidInterfaces(interfaces){
        this._validInterfaces=Array.isArray(interfaces) ? interfaces : interfaces.split(",")
    }
    async restart() {
        logger.debug("Ready restart networking...")
        try {
            let resetNetAction = shell.exec("sudo service networking restart", {silent: true, timeout: 5000});
            if (resetNetAction.stderr) {
                throw new Error(_("Error while restarting network:{err}").params(String(resetNetAction.stderr)))
            }
        } catch (e) {
            throw new Error(_("Timeout while restarting network."))
        }

    }
    /**
     * 配置
     * @param restart
     * @param configs ={
     *      interface:{
     *          dhcp:true/false,
     *          wpa-ssid
     *          wpa-psk
     *          address:
                netmask:
                gateway:
                dns-nameservers:
     *      }
     * }
     */

    async configure(configs,restart=true) {
        this._assertReady()
        //先读取原始接口配置文件
        let oldInterfaces=this._parseInterfaces(fs.readFileSync(this.interfaceFile,{encoding:"utf8"}))
        //将default转换成真正的默认网络接口
        if("default" in configs){
            if(VIGPlatform.network.default in oldInterfaces){
                configs[VIGPlatform.network.default]=Object.assign(oldInterfaces[VIGPlatform.network.default],configs["default"])
            }else{
                configs[VIGPlatform.network.default]=configs["default"]
            }
            delete configs["default"]
        }
        //检测网络接口是否
        for(let iname in configs){
            if(!(iname in oldInterfaces) || iname==="lo"){
                throw new Error(_("Network interfaces <{name}> is invalid").params(R.keys(configs).join(",")))
            }
        }
        //合并到旧的接口中
        deepMerge(oldInterfaces,configs)
        //检查，如果接口启用了dhcp，则删除其他接口数据像address等
        //因为启用dhcp后不需要配置ip地址网关等数据
        for(let iName in oldInterfaces){
            if(oldInterfaces[iName].dchp){
                delete oldInterfaces[iName].address
                delete oldInterfaces[iName].netmask
                delete oldInterfaces[iName].gateway
                delete oldInterfaces[iName].network
                delete oldInterfaces[iName].broadcast
            }
        }
        //生成接口配置文件的内容
        let newInterfacesContents=this._generateConfig(oldInterfaces)
        //更新文件
        try{
            fs.writeFileSync(this.interfaceFile,newInterfacesContents)
        }catch(e){
            //如果出错
            throw new Error(_("Modifying the network interface error:{error}").params(e.message))
        }
        //如果提供回调函数，则重启网络接口
        if(restart){
            try{
                await this.restart()
                logger.debug(_("Network restarts success"))
            }catch (e) {
                logger.debug(e.message)
            }
        }
        return this.interfaces
    }
    _parseInterfaces(content){
        let lines=content.split("\n")
        let interfaces={},curInterface=null
        for(let line of lines){
            if(line.trim().startsWith("iface")){
                line=line.trim().replace(/\s+/g," ")
                let interLine=line.split(" ")
                //排除lo,
                if(interLine.length>1 && interLine[1]!=="lo"){
                    curInterface=interLine[1]
                    interfaces[curInterface]={}
                    if(interLine.length>2){
                        interfaces[curInterface]["family"] = interLine[2]==="inet6" ? "ipv6" : "ipv4"
                    }
                    if(interLine.length===4 && ["dhcp","static"].includes(interLine[3])){
                        interfaces[curInterface]["dhcp"] = interLine[3]==="dhcp"
                    }
                }
                continue
            }
            //如果遇到空行，则结束当前接口
            if(line.trim()==="") curInterface=null
            if(curInterface){
                if(line.trim().startsWith("address"))  interfaces[curInterface]["address"]=line.trim().substr(8).trim()
                if(line.trim().startsWith("netmask"))  interfaces[curInterface]["netmask"]=line.trim().substr(8).trim()
                if(line.trim().startsWith("gateway"))  interfaces[curInterface]["gateway"]=line.trim().substr(8).trim()
                if(line.trim().startsWith("broadcast")) interfaces[curInterface]["broadcast"]=line.trim().substr(10).trim()
                if(line.trim().startsWith("network"))  interfaces[curInterface]["network"]=line.trim().substr(8).trim()
                if(line.trim().startsWith("dns-nameservers")) {
                    interfaces[curInterface]["dns"]=line.trim().substr(16).trim().replace(/\s+/g," ").split(" ")
                }
            }
        }
        return interfaces
    }
    _assertReady(){
        assert(this.ready,_("Unable to obtain network interface"))
    }

    /**
     * 当通过读取/etc/network/interfaces失败时，
     * 尝试通过IfConfig的方式获取网络参数
     *
     * @return {Promise<any>}
     * @private
     */
    _getInterfacesByIfConfig(){
        let net=require("network")
        return new Promise((resolve, reject) => {
            net.get_interfaces_list((err, list)=>{
                if(err){
                    reject(err)
                }else{
                    let dns=require("dns")
                    let results={}
                    list.forEach((item)=>{
                        results[item.name]={
                            address:item.ip_address,
                            gateway:item.gateway_ip,
                            netmask:item.netmask,
                            type:item.type,
                            dns:dns.getServers()
                        }
                    })
                    resolve(results)
                }
            })
        })
    }
    /**
     * [
     * {    name: 'enp0s31f6',
            ip_address: '192.168.118.129',
            mac_address: '54:e1:ad:56:1b:44',
            gateway_ip: '192.168.118.1',
            netmask: '255.255.255.0',
            type: 'Wired' },
     { name: 'wlp3s0',
       ip_address: '192.168.103.247',
       mac_address: 'ac:ed:5c:67:ea:21',
       gateway_ip: '192.168.103.1',
       netmask: '255.255.255.0',
       type: 'Wireless' } ]

     * @return {Promise<any>}
     */
    async interfaces(){
        this._assertReady()
        let ins={}
        try{
            let interfacesContents=fs.readFileSync(this.interfaceFile,{encoding:"utf8"})
            this._parseInterfaces(interfacesContents)
        }catch (e) {

        }
        //如果通过读取interfaceFile失败，则通过ifconfig获取
        if(R.keys(ins).length===0){
            return await this._getInterfacesByIfConfig()
        }
    }
    /**
     * 校验配置参数，如果出错会触发异常
     */
    checkIConfig(iConfig){
        let isValid=true,ipErrMsg="invalid ip address"
        if(iConfig.address) assert(iputils.isValidIp(iConfig.address),ipErrMsg)
        if(iConfig.netmask) assert(iputils.isValidIp(iConfig.address),ipErrMsg)
        if(iConfig.gateway) assert(iputils.isValidIp(iConfig.gateway),ipErrMsg)
        //校验DNS地址
        if(!Array.isArray(iConfig.dns)) iConfig.dns=iConfig.dns.split(" ")
        iConfig.dns.forEach((item)=>{
            if(item.trim()!=="") assert(iputils.isValidIp(iConfig.address),ipErrMsg)
        })
        iConfig.dns=iConfig.dns.join(" ")
        if(iConfig.broadcast) assert(iputils.isValidIp(iConfig.broadcast),ipErrMsg)
        if(iConfig.network) assert(iputils.isValidIp(iConfig.network),ipErrMsg)
        return true
    }
    _generateConfig(configs){
        let output= []
        //默认配置
        output.push('auto lo')
        output.push('iface lo inet loopback')
        for (let interfaceName in configs){
            interfaceName=interfaceName.toLowerCase()
            if(this._validInterfaces.length>0 && !this._validInterfaces.includes(interfaceName)) continue
            let iConfig=configs[interfaceName]
            this.checkIConfig(iConfig)
            output.push('')
            output.push('auto '+interfaceName)
            //接口名称，及dhcp
            output.push('iface '+interfaceName+' inet ' + (iConfig.dhcp ? "dhcp" : "static"))
            //wifi配置参数
            if (iConfig.ssid) output.push('  wpa-ssid '+iConfig.ssid)
            if (iConfig.psk) output.push('  wpa-psk '+iConfig.psk)
            //常规配置参数
            if (iConfig.address) output.push('  address '+iConfig.address)
            if (iConfig.netmask) output.push('  netmask '+iConfig.netmask)
            if (iConfig.gateway) output.push('  gateway '+iConfig.gateway)
            if (iConfig.network) output.push('  network '+iConfig.network)
            if (iConfig.broadcast) output.push('  broadcast '+iConfig.broadcast)
            if (iConfig.dns) output.push('  dns-nameservers '+iConfig.dns)
        }
        return output.join("\n");
    }
}


/**
 * 保存当前网络配置
 * @return  返回备份的网络配置数据
 */
async function backupNetworkConfig(){
    try{
        let bkfile=path.join(VIGConsts.Folders.temp,"networks.json")
        let netCfg=new NetworkConfigurator()
        let curCfg=await netCfg.interfaces()
        if(fs.existsSync(bkfile)) fs.unlinkSync(bkfile)
        fs.writeFileSync(bkfile, JSON.stringify(curCfg),{encoding:"utf-8"})
        return curCfg
    }catch (e) {
        logger.warn(_("Error while backup network config"))
        return false
    }
}

/**
 * 恢复当前网络配置
 */
async function restoreNetworkConfig(){
    let bkfile=path.join(VIGConsts.Folders.temp,"networks.json")
    if(fs.existsSync(bkfile)){
        let netCfg=new NetworkConfigurator()
        try{
            await netCfg.configure(JSON.parse(fs.readFileSync(bkfile,{encoding:"utf-8"})))
        }catch (e) {
            logger.warn(_("Error while restore network config"))
        }
        fs.unlinkSync(bkfile)
    }
}


module.exports={
    NetworkConfigurator,
    backupNetworkConfig,
    restoreNetworkConfig
}