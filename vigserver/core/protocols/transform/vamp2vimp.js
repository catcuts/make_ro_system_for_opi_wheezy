/*　China Fujian Huanyutong Technology Co., Ltd. */
const VIMP=require("core/protocols/vimp/message"),{MessageTypes:MessageTypes}=require("../vamp/constants"),TransRules=require("./rules"),decodeParams=require("../vamp/message").decodeParams,{getPayloadRulesParams:getPayloadRulesParams,getAttrsPayloadRulesParams:getAttrsPayloadRulesParams}=require("./utils");function convertAnswerCode(e){let a=String(e);return 100*parseInt(a.charAt(0))+parseInt(a.charAt(1))}function convertPayloadFields(e,a,s,o={}){let t={},r=a.__reverse||{},l=s.__reverse||{},d=o.__reverse||{},n={},i={};for(let o in e){let c=o;o in l?c=l[o]:o in r?c=r[o]:o in d&&(c=d[o]),fieldRule=c in s?s[c]:c in a?a[c]:{},Buffer.isBuffer(e[o])?(fieldRule&&fieldRule.valuetype&&(n[c]=fieldRule.valuetype),i[c]=e[o]):t[c]=e[o]}return i=decodeParams(i,n),Object.assign(t,i),t}function convertEventMessage(e){let a=VIGDevices.getDeviceTypeName(e.from),s=e.payload.code;params=convertPayloadFields(e.payload,...getPayloadRulesParams(TransRules,"Events",a,String(s)));let o={from:e.from,sid:e.sid,source:e.from,code:s,level:e.payload.level};return o.payload=params,VIMP.Event(o)}function convertAnswerMessage(e){let a=VIGDevices.getDeviceTypeName(e.from),s=String(e.payload.code);s=100*parseInt(s.charAt(0))+parseInt(s.charAt(1)),e.payload.code=s;let o=convertPayloadFields(e.payload,...getAttrsPayloadRulesParams(TransRules,a));return VIMP.Answer({code:s,message:e.payload.message||"",payload:{...o}})}function convertNotifyMessage(e){let a=getDeviceTypeConvertRules(e.to),s=convertPayloadFields(e.payload,CommonRules.Notifys,a.Notifys);return VIMP.Notify({tid:e.payload.tid,code:e.payload.code,level:e.payload.level,message:e.payload.message,source:encodeSerialNo(e.payload.source),...s})}function convertAlarmMessage(e){let a=getDeviceTypeConvertRules(e.to),s=convertPayloadFields(e.payload,CommonRules.Notifys,a.Notifys);return VIMP.Alarm({tid:e.payload.tid,code:e.payload.code,level:e.payload.level,message:e.payload.message,source:encodeSerialNo(e.payload.source),...s})}function convertActionMessage(e){let a=getDeviceTypeConvertRules(e.to),s=convertPayloadFields(e.payload,CommonRules.Notifys,a.Notifys);return VIMP.Alarm({tid:e.payload.tid,code:e.payload.code,level:e.payload.level,message:e.payload.message,source:encodeSerialNo(e.payload.source),...s})}function VampToVimp(e){let a={};switch(e.type){case MessageTypes.Register:a=VIMP.Register({from:e.from,attrs:e.payload});break;case MessageTypes.Notify:a=convertNotifyMessage(e);break;case MessageTypes.Attrs:break;case MessageTypes.Action:a=convertActionMessage(e);break;case MessageTypes.Alarm:a=convertAlarmMessage(e);break;case MessageTypes.Event:a=convertEventMessage(e);break;case MessageTypes.Message:case MessageTypes.Data:case MessageTypes.Query:break;case MessageTypes.Answer:a=convertAnswerMessage(e)}if(Object.assign(a,{from:e.from,to:e.to,sid:e.sid,flags:e.flags}),"object"==typeof a.payload&&"tid"in a.payload)try{Buffer.isBuffer(e.payload.tid)?a.tid=e.payload.tid.readUInt32BE():a.tid=a.payload.tid,delete a.payload.tid}catch(e){logger.warn(_("Invalid tid"))}return a}module.exports=VampToVimp;