/*　China Fujian Huanyutong Technology Co., Ltd. */
const msgpack=require("msgpack5")();function serialize(e){try{return VIGateway.debug?Buffer.from(JSON.stringify(e)):msgpack.encode(e)}catch(e){logger.debug(_("Error while serialize message:").params(e.stack))}}function deserialize(e){let r=null,a=!1;try{r=VIGateway.debug?JSON.parse(e):msgpack.decode(e)}catch(e){a=e.stack}if(!r)try{r=VIGateway.debug?msgpack.decode(e):JSON.parse(e)}catch(e){a=e.stack}if(a)throw logger.debug(_("Error while deserialize received message:{err}").params(a)),new Error(a);return r||{}}module.exports={serialize:serialize,deserialize:deserialize};