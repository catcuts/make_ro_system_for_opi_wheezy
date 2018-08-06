/*　China Fujian Huanyutong Technology Co., Ltd. */
const ServiceBase=require("core/service/servicebase"),http=require("http"),Notifys=require("core/eventbus/notifys");class HTTPService extends ServiceBase{init(){this.port=80}onError(e){let r="";if("listen"!==e.syscall)throw e;let t="string"==typeof this.port?"Pipe "+this.port:"Port "+this.port;switch(e.code){case"EACCES":r=_("Permission denied,{bind} requires elevated privileges").params(t);break;case"EADDRINUSE":r=_("{bind} is already in use").params(t);break;default:throw r=e,e}logger.debug(r),VIGEventbus.publish(Notifys.HTTPError,{message:r})}onListening(){let e=this.address(),r="string"==typeof e?"pipe "+e:"port "+e.port;logger.info(_("HTTPServer listening on {port}.").params(r)),VIGEventbus.publish(Notifys.HTTPReady,{port:e.port})}async start(){try{this.httpserver=http.createServer(this.server.webserver.express),this.port=this.host.Attrs.port||80,this.httpserver.listen(this.port),this.httpserver.on("error",this.onError.bind(this)),this.httpserver.on("listening",this.onListening)}catch(e){logger.error(_("Error while create httpserver:{message}").params(e.stack))}}async stop(){return await new Promise((e,r)=>{this.httpserver.close(()=>{VIGEventbus.publish(VIGEventbus.publish(Notifys.HTTPClosed).HTTPClosed),e()})})}}module.exports=HTTPService;