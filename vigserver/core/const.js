/*　China Fujian Huanyutong Technology Co., Ltd. */
const path=require("path"),fs=require("fs");function initDataFolder(o){for(let t in o)try{fs.existsSync(o[t])||fs.mkdirSync(o[t])}catch(o){console.error(`Error while initializing data dataFolder <${dataFolder}>:${o.stack}`)}}let RUNMODE=process.env.VIG_RUNMODE||"default",DEBUG=process.env.VIG_DEBUG||!1,VIGRootFolder=path.resolve(__dirname,".."),DataRootFolder=process.env.VIG_DATAROOT_FOLDER||path.resolve(VIGRootFolder,"data");const Folders={initdata:path.join(DataRootFolder,"initdata"),storage:path.join(DataRootFolder,"storage"),logs:path.join(DataRootFolder,"logs"),settings:path.join(DataRootFolder,"settings"),schedule:path.join(DataRootFolder,"schedule"),resources:path.join(DataRootFolder,"resources"),sequences:path.join(DataRootFolder,"sequences"),language:path.join(DataRootFolder,"language"),temp:path.join(DataRootFolder,"temp")};fs.access(DataRootFolder,function(o){o||initDataFolder(Folders)});let languageRootFolder=path.join(DataRootFolder,"language");global.VIGConsts={VIGRootFolder:VIGRootFolder,Folders:Folders,RUNMODE:RUNMODE,DEBUG:DEBUG,DataRootFolder:DataRootFolder,languageRootFolder:languageRootFolder,DEFAULT_SECRET:"5cc91a885be749f99f17052112e8b31d",ISSUER:"http://www.huanyutong.com",AUDIENCE:"MEEYI"},global.getError=function(o){try{return VIGateway.debug?o.stack:o.message}catch(o){return String(o)}},global.R=require("ramda"),module.exports=global.VIGConsts;