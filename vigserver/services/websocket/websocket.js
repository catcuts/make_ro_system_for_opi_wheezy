/*　China Fujian Huanyutong Technology Co., Ltd. */
const websocketServer=require("socket.io"),VIGSettings=require("../../settings/settings");class WebMessageBus{constructor(e){this.status="initial"}start(e){try{this.server=new websocketServer(e,VIGateway.websocket||{}),this.server.on("connection",function(e){logger.debug(_("webbus client connected:{client}").params(e))}),this.status="ready"}catch(e){logger.error(_("Error while creating webbus websocket:{e}").params(e.stack))}}stop(){this.server=null}}