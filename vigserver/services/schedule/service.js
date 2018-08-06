/*　China Fujian Huanyutong Technology Co., Ltd. */
const cron=require("cron"),util=require("util"),path=require("path"),ServiceBase=require("core/service/servicebase"),async=require("async"),{requireFolder:requireFolder}=require("utils/requirefolder"),{VIGModuleStatus:VIGModuleStatus}=require("core/vigmodule");class ScheduleService extends ServiceBase{init(){this.jobs=[],this.loadDefaultJobs()}loadDefaultJobs(){let e=requireFolder(path.join(__dirname,"jobs"));this.registerJobs(e)}registerJobs(e){let r=[],s=[];if(Array.isArray(e))r.push(...e);else if(util.isFunction(e)){let s=e();util.isObject(s)?r.push(s):util.isArray(s)&&r.push(...s)}else util.isObject(e)&&r.push(e);for(let e of r)if(util.isObject(e))if(util.inspect(e).startsWith("CronJob"))s.push(e);else try{e.timeZone=VIGateway.timeZone||"Asia/Shanghai",e.start=!1,s.push(new cron.CronJob(e))}catch(e){logger.error(_("Error in creating schedule'job:{e}".params(e.stack)))}else logger.warn(_("schedule job type error:{e}".params(e)));this.jobs.push(...s),this.status===VIGModuleStatus.Runing&&this.startJobs(s)}startJobs(e){async.parallel(e.map(e=>r=>{try{e.start(),r()}catch(e){r(e)}}),function(e,r){})}async start(){this.startJobs(this.jobs)}async stop(){async.parallel(this.jobs.map(e=>r=>{try{e.stop(),r()}catch(e){r(e)}}))}}module.exports=ScheduleService;