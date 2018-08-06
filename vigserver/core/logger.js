/*　China Fujian Huanyutong Technology Co., Ltd. */
const log4js=require("log4js"),path=require("path"),fs=require("fs"),Datastore=require("nedb"),{readYamlFile:readYamlFile}=require("utils/yaml"),defaultLoggerSettings={level:"debug",output:"console,file",fileSize:5242880,fileCount:3,server:""};function getLoggerSettings(){let e=path.join(VIGConsts.DataRootFolder,"storage","devices.dat");if(fs.existsSync(e)){let t=new Datastore({filename:e,autoload:!0});return new Promise((e,o)=>{t.findOne({__host__:!0},(t,l)=>{t?o(t):e(l?l.logger:defaultLoggerSettings)})})}return e=path.join(VIGConsts.DataRootFolder,"initdata","devices.yaml"),new Promise((t,o)=>{t(readYamlFile(e).logger)})}function configutorLogger(e){let t=path.join(VIGConsts.DataRootFolder,"logs"),o=e.level,l=(e.output||"console,file").split(",")||["console"],i=e.fileSize||5242880,r=e.fileCount||3,n={appenders:{console:{type:"console",category:"console",layout:{type:"pattern",pattern:"[%[%p%]] %d{yyyy/MM/dd hh.mm.ss} - %m"}},file:{type:"file",maxLogSize:i,filename:path.join(t,"log.txt"),backups:r,layout:{type:"pattern",pattern:"[%p] %d{yyyy/MM/dd hh.mm.ss} - %m"}}},categories:{default:{appenders:l,level:o}}};return log4js.configure(n),log4js.getLogger()}async function initLogger(e){let t,o={level:"debug",output:"console,file",fileSize:5242880,fileCount:3,server:""};o=e?Object.assign(o,e):Object.assign(o,await getLoggerSettings());try{t=configutorLogger(o)}catch(e){console.error("Error when initializing log module"),t=configutorLogger(defaultLoggerSettings)}t.reset=function(){initLogger().then(()=>{t.debug("Log module reset success.")}).catch(e=>{t.debug("Log module reset fail.")})},global.logger=t}module.exports=initLogger;