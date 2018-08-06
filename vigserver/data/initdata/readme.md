  
# 一.网关属性
 
## name
  设备名称  
## sn
  设备序列号，如值="__host__",代表是网关设备本身．初始化加载时，将__host__替代为当前网关设备的SN
##title
  设备标题，一般用来显示友好名称  
##language:
  设备语言，默认是en-US
##domain
  设备所连接的消息域，详见VIMP协议介绍．默认值0
##debug
  调试开关，并启用消息采用msgpack编码，并且logger级别调至warn
##remain
  是否在启动后加载此设备实例，默认为false
##enabled
  设备有效性，只对网关的下属设备有效．
## owner
  设备所有者
## customer
  设备客户名称
## dept
  该设备所属部门
  
## description:
##version: 1.0
    #工作模式，取值0=联网协作模式,默认连接到MQTT；1=独立模式,不连接到MQTT
##mode: 0
    #消息处理行为
    #0-自动，如果工作在独立模式下总是规则引擎处理，在联网模式下，先发送给服务器，如果服务器未连接，则由规则引擎处理
    #1-本地规则引擎进行处理 ,2- 总是转发至服务器进行处理
##behavior: 0
    #是否支持无线漫游0:默认,不支持漫游；1：组播漫游，2：云端漫游
##roaming: 0
    #漫游编号
##roamingGroup: 0
    #漫游域，当云端漫游时使用来标识漫游
##roamingDomain:
##type: VIGateway
    # 所在时区
##timeZone: Asia/Shanghai
    # 型号
##model: VIG9002
    # 安全密钥
##secret: 5cd29c05899347deb711a45f875f65ba
    # Web服务器侦听端口
##port: 80
    #VIG设备所在的地理位置,经度、纬度、高程
##location:
      longitude:
      latitude:
      altitude:
    # 新发现的设备自动激活,False时会将发现的设备上报给服务器
    # true : 自动加入到设备清单中
##autoDiscover: true
    #设备分组路径，如果没有指定则默 认是/o
##group:
    # 设备事务参数
##transaction:
      # 事务超时处理时间，以分钟为单位
      timeout: 60
      #保留事务长度,0-默认1000条,
      maxLength: 0
      # 已完成事务保留时间，0-不保留
      dataKeepTime: 0


    # 设备网络地址配置
##network:
      # 默认有线网络
      default:
        title: 默认网络
        enabled: true
        dns: auto
        dhcp: false
        ip: 192.168.0.1
        subnetMask: 255.255.255.0
        gateway: 0.0.0.0
      wifi:
        title: 无线网络
        enabled: false
        password:
        dns: auto
        dhcp: false
        ip: 192.168.0.1
        subnetMask: 255.255.255.0
        gateway: 0.0.0.0
    # 设备作为无线AP使用
    ap:
      enabled: false
      name: MeeYiAP
      password:
    # 内置DHCP服务器配置
    dhcp:
      enabled: false
      range:
    #缓存管理，允许创建多个缓存
##caches:
      - name: devicestatus
        title:
        description: Managing device state caching
        enabled: true
    # 日志配置
##logger:
      level: DEBUG
      # 日志输出目标设置，如果要输出到logServer需加入server
      output: console,file
      # 日志文件最大尺寸
      fileSize:
      # 日志文件备份数量，默认3
      fileCount: 3
      # 日志服务器地址,默认使用UDP协议,如udp://192.168.1.1
      server:
    # 消息总线
##eventbus:
      # 脉搏信号,默认每2秒产生一个信号,0-不产生
      pulse: 2000
    # 连接到MQTT Broker的配置参数
##mqtt:
      broker: mqtt://127.0.0.1
      username:
      password:
      strict: false

#设备类型属性

##name: vigateway
##title: Voerka IoT Wireless Gateway
##model: VIG9002
##behavior: 0
##entry: devices/vigateway/vigateway
##enabled: true
##advanced:
      # 设备的连接行为 0 - 设备会休眠，仅仅在必要时向网关发送数据  1 - 设备需要由网关进行唤醒  2 - 始终在线，可以随时进行通讯
###connectBehavior: 2
      # 指定当接收到设备消息时的处理行为，0-由设备类型类自己处理，1-优先转发至云端服务器处理,2-由规则引擎优先处理
###msgHandleBehavior: 0
      # 保留属性 当获取设备的详细属性时，不包括的属性名称
###reservedAttrs: []
      # 只读属性
###readOnlyAttrs: []
      # 则默认所有属性均不会同步到设备,如果需要同步到设备的属性,需要在此指定，
###syncAttrs: []
###softSyncAttrs: []
      # 允许添加的属性
###allowAddAttrs: []
      # 允许删除的属性
###allowDeleteAttrs: []
    #　列出此设备类型支持的所有属性
    # 设备类型属性元数据　
###meta:
      attrs:
        name:
        title:
        mode
        model:
        behavior:
        owner:
        dept:
        customer:
        enabled:
        debug:
        sn:
        datetime:
        parent:
        token:
        icon:
        language:
        charset:
        domain:
        keepalive:
        timeZone:
        description:
        group:
        broadcast:
        rules:
          valuetype: map-array
          #  映射路径，如果为空，代表整个存储对象映为一个属性
       　 #  先用select(NEDB语法)查询Storage记录
          # 然后用where对记录
       　 ＃ 数据进行提取
          # where: 参考gson-query语法对检索
          select: {"name":"vmc"}
          where: transfers/*?name:abc
          storage: rules
        mqtt:
          valuetype: map
          broker:
          username:
          password:
          strict:
          keepalive:
          reconnectPeriod:
          connectTimeout:
        logger:
          enabled:
          output:
          fileSize:
          fileCount:
          server:
        location:
          label:
          longitude:
          latitude:
          altitude:
      network:
        default:
          label:
          dhcp:
          ip:
          subnetMask:
          dns:
          gateway:
        wifi:
          enabled:
          ap:
          password:

 
      
# 服务属性



# 应用属性
      
      
      
## 用户属性