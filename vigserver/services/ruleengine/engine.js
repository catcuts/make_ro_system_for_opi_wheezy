/*　China Fujian Huanyutong Technology Co., Ltd. */
const RuleFuncs=require("./funcs").getFuncs(),generateAllRuleScript=require("./genScripts"),{MessageTypeNames:MessageTypeNames}=require("core/protocols/vimp/constants"),VM=require("vm"),RuleEngineNotReadyError=new Error("RuleEngine is not ready.");function inScope(e,t,r){if(""===r||"*"===r)return!0;let s=t.from,i=r.split(","),n=!1;for(let t of i)try{if(t.startsWith("@"))n=t.substr(1).toLowerCase()===e.type.toLowerCase();else if(t.startsWith("#"))n=t.substr(1).toLowerCase()===s.toLowerCase();else if(t.startsWith("!")){let r=t.substr(1).split("=");2===r.length&&(n=e[r[0]]===r[1])}else n=t.toLowerCase()===String(e.name).toLowerCase();if(n)return!0}catch(e){logger.warn(_("Invalid scope <{scope}> parameters").params(t))}return!1}function inTimeSlot(e){if(""===e.trim())return!0;let t=e.replace("  "," ").split(" ");if(6!==t.length)return console.log("Rule timeslot format error."),!0;function r(e,t,r,s){let i=parseInt(e);if("*"===t)return!0;if(-1===t.indexOf("-"))return i>=r&&i<=s;{let e=t.split("-");return(e=e.map(e=>parseInt(e)))[0]=isNaN(e[0])?r:e[0],e[1]=isNaN(e[1])?s:e[1],e[0]=e[0]<r?r:e[0],e[1]=e[1]>s?s:e[1],e[1]<e[0]&&([e[0],e[1]]=[e[1],e[0]]),i>=e[0]&&i<=e[1]}}let s=new Date,i=s.getSeconds(),n=s.getMinutes(),o=s.getHours(),a=s.getDate()+1,l=s.getMonth()+1,c=s.getDay()+1;return r(i,t[0],0,59)&&r(n,t[1],0,59)&&r(o,t[2],0,23)&&r(a,t[3],0,31)&&r(l,t[4],1,12)&&r(c,t[5],1,7)}function getMessageTypeName(e){try{return MessageTypeNames[e].toLowerCase()}catch(e){return""}}class RuleEngine{constructor(e){this._options=Object.assign({timeout:6e5},e||{}),this.ready=!1}async loadRules(e){let t={};MessageTypeNames.forEach((r,s)=>{r=r.toLowerCase(),t[r]=e.filter(function(e,t){return-1!==(e.on||"*").toLowerCase().split(",").indexOf(r)})}),t["*"]=e.filter(function(e,t){let r=e.on||"*";return""===r||"*"===r});for(let e in t)t[e]=t[e].sort((e,t)=>(t.priority||0)-(e.priority||0));this.compileRuleScripts(t)}compileRuleScripts(e){try{this._script=new VM.Script(generateAllRuleScript(e)),this.ready=!0}catch(e){this.ready=!1,logger.error(_("Error while compile rule scripts:{err}").params(e.message))}}execute(e,t={}){let r=(new Date).getTime();if(!1===this.ready)throw RuleEngineNotReadyError;let s=VIGDevices.getDevice(e.from),i={VIGateway:VIGateway,DeviceManager:VIGDevices,tid:void 0===e.tid?0:e.tid,message:e,device:s},n=this._script.runInNewContext({context:i,Message:e,Device:s,inScope:inScope,inTimeSlot:inTimeSlot,getMessageTypeName:getMessageTypeName,...RuleFuncs,...t},this._options);return logger.debug("Rule execution time："+String((new Date).getTime()-r)+"ms"),n}}module.exports=RuleEngine;