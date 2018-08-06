/*　China Fujian Huanyutong Technology Co., Ltd. */
const{MessageTypes:MessageTypes,AnswerCode:AnswerCode}=require("./constants"),PStructs=require("./structs"),Struct=require("varstruct"),StringArrayParamStruct=Struct([{name:"items",type:Struct.VarArray(Struct.Byte,Struct.VarString(Struct.Byte))}]),IntegerParamStruct=Struct([{name:"items",type:Struct.VarArray(Struct.Byte,Struct.Int32BE)}]);function calcParity(e){let a=0;for(let r of e)a+=r;return a%2}function verifyParity(e,a){return a===calcParity(e)}function encodeSerialNo(e){if(void 0===e)return Buffer.alloc(4);let a=Buffer.alloc(4);try{e.length<8&&(e+=new Array(9-e.length).join("0"));for(let r=0;r<8;r+=2)a.writeUInt8(parseInt(e.substr(r,2),16),r/2)}catch(a){logger.error(_("Invalid subdevice serialNo:{sn}").params(String(e)))}return a}function decodeSerialNo(e){try{return e.toString("hex")}catch(a){return logger.warn("Error while decode serialno:{value}".params(e)),"00000000"}}function decodeMessageflags(e){let a={};return a.qos=1&e,a.reply=1==(2&e),a.direct=0==(4&e)?0:1,a.serialize=0==(8&e)?0:1,a.parity=0==(16&e)?0:1,a.receipt=1==(32&e),a}function encodeMessageFlags(e){let a=0;return"qos"in e&&(a=1===e.qos?1:0),"reply"in e&&(a+=1===e.reply?2:0),"direct"in e&&(a+=1===e.direct?4:0),"serialize"in e&&(a+=1===e.serialize?8:0),"parity"in e&&(a+=1===e.parity?16:0),"receipt"in e&&(a+=1===e.receipt?32:0),a}function encodeParams(e,a={},r=[]){let t={};for(let o in e){let s=e[o];if(r.includes(o))continue;let c=Buffer.alloc(0);if("object"==typeof s||o in a){let e="",r=0;"object"==typeof s?(datetype=(s.datatype||"").toLowerCase(),r=s.value):(e=a[o],r=s);try{switch(e){case"char":case"uint8":case"byte":case"boolean":case"bool":(c=Buffer.alloc(1)).writeUInt8(255&r);break;case"uint16":(c=Buffer.alloc(2)).writeUInt16BE(65535&r);break;case"int16":(c=Buffer.alloc(2)).writeInt16BE(65535&r);break;case"uint32":case"int32":case"int":case"float":c=Buffer.alloc(4),"float"===e?c.writeFloatBE(r):"int32"===e?c.writeInt32BE(r):c.writeUInt32BE(r);break;case"sn":c=Buffer.from(encodeSerialNo(r));break;case"long":case"double":(c=Buffer.alloc(8)).writeDoubleBE(r);break;case"string":c=Buffer.from(r);break;case"string-array":case"str-array":c=StringArrayParamStruct.encode({items:r});break;case"int-array":case"integer-array":c=IntegerParamStruct.encode({items:r})}}catch(e){logger.warn(_("Error while encode vamp param <{key}>:{value}").params(o,r))}t[o]=c}else"number"==typeof s&&(parseInt(s)===s?s>65535?(c=Buffer.alloc(4)).writeInt32BE(s):s<=255?(c=Buffer.alloc(1)).writeUInt8(s):(c=Buffer.alloc(2)).writeInt16BE(s):(c=Buffer.alloc(4)).writeFloatBE(s),t[o]=c)}return t}function decodeParams(e,a={}){if(!a)return e;let r={};for(let t in e){let o=e[t];if(t in a)try{switch((a[t]||"").toLowerCase()){case"sn":o=decodeSerialNo(o);break;case"char":o=String.fromCharCode(49);break;case"uint8":case"byte":case"boolean":case"bool":o=o.readUInt8(0);break;case"int16":o=(o&=65535).readInt16BE();break;case"uint16":o=(o&=65535).readUInt16BE();break;case"long":case"float":o=o.readFloatBE();break;case"int32":o=o.readInt32BE();break;case"uint32":o=o.readUInt32BE();break;case"double":o=o.readDoubleBE();break;case"string-array":case"str-array":o=StringArrayParamStruct.decode(o).items;break;case"int-array":case"integer-array":o=IntegerParamStruct.decode(o).items;break;case"string":case"str":default:o=o.toString()}}catch(e){logger.warn(_("Error while decode params <{key}>:{value}").params(t,o.toString("hex")))}r[t]=o}return r}function encodeMessage({type:e=0,from:a="",to:r="",sid:t=0,flags:o={},roaming:s=0,payload:c=null}={}){null===c&&(c=Buffer.alloc(0)),o.parity=calcParity(c),o.direct=1,flagValue=encodeMessageFlags(o);try{return PStructs.MessageStruct.encode({type:e,from:encodeSerialNo(a),to:encodeSerialNo(r),sid:t,flags:flagValue,roaming:0===s?VIGateway.roamingGroup:s,payload:c})}catch(e){throw new Error(_("Error while encode vamp message:{error}").params(e.message))}}function decodeMessage(e){try{let a=PStructs.MessageStruct.decode(e);return a.flags=decodeMessageflags(a.flags),a.from=decodeSerialNo(a.from),a.to=decodeSerialNo(a.to),verifyParity(a.payload,a.flags.parity)||logger.warn(_("VAMP data parity error")),a}catch(a){throw new Error(_("Error while decode VAMP data {data}:\n{err}").params(e.toString("hex"),a.stack))}}function decodePayload(e){return(a,r={})=>{let t=e.decode(a);return Object.assign(t,decodeParams(t.params,r)),delete t.params,t}}function encodePayload(e,a={}){return({paramTypes:r={},...t}={})=>{let o={},s=R.keys(a);s.forEach(e=>{o[e]=t[e]||a[e]});let c={...o,params:encodeParams(t||{},r,s)};return e.encode(c)}}const EventMessage={encodePayload:encodePayload(PStructs.EventPayloadStruct,{code:0,level:0}),decodePayload:decodePayload(PStructs.EventPayloadStruct)},NotifyMessage={encodePayload:encodePayload(PStructs.NotifyPayloadStruct,{code:0,level:0,message:"",tid:0,source:"00000000"}),decodePayload:decodePayload(PStructs.NotifyPayloadStruct)},ActionMessage={encodePayload:encodePayload(PStructs.ActionPayloadStruct,{code:0,flags:0}),decodePayload:decodePayload(PStructs.ActionPayloadStruct)},AttrsMessage={encodePayload:encodePayload(PStructs.AttrsPayloadStruct,{operate:0}),decodePayload:decodePayload(PStructs.AttrsPayloadStruct)},AlarmMessage={encodePayload:encodePayload(PStructs.AlarmPayloadStruct,{code:0,level:0}),decodePayload:decodePayload(PStructs.AlarmPayloadStruct)},AnswerMessage={encodePayload:encodePayload(PStructs.AnswerPayloadStruct,{code:0,message:""}),decodePayload:decodePayload(PStructs.AnswerPayloadStruct)},QosAnswerMessage=function({...e}={}){return encodeMessage({type:MessageTypes.Answer,from:VIGateway.shortSn,roaming:VIGateway.roamingGroup,payload:PStructs.AnswerPayloadStruct.encode({code:AnswerCode.QosAnswer,message:"",params:{}}),...e})},QueryMessage={encodePayload:({type:e=0,flags:a=0,fields:r=[]})=>PStructs.QueryPayloadStruct.encode({flags:a,fields:r,type:e}),decodePayload:e=>PStructs.QueryPayloadStruct.decode(e)},RegisterMessage={encodePayload:({version:e="",name:a="",wireless:r=0,type:t="",model:o=""}={})=>PStructs.RegisterPayloadStruct.encode({version:e,name:a,wireless:r,type:t,model:o}),decodePayload:e=>PStructs.RegisterPayloadStruct.decode(e)};module.exports={decodeSerialNo:decodeSerialNo,encodeSerialNo:encodeSerialNo,encodeMessage:encodeMessage,decodeMessage:decodeMessage,AnswerMessage:AnswerMessage,RegisterMessage:RegisterMessage,NotifyMessage:NotifyMessage,AttrsMessage:AttrsMessage,ActionMessage:ActionMessage,AlarmMessage:AlarmMessage,EventMessage:EventMessage,QueryMessage:QueryMessage,QosAnswerMessage:QosAnswerMessage,encodeParams:encodeParams,decodeParams:decodeParams};