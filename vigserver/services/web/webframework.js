/*　China Fujian Huanyutong Technology Co., Ltd. */
const path=require("path"),log4js=require("log4js"),express=require("express"),favicon=require("serve-favicon"),passport=require("passport"),cookieParser=require("cookie-parser"),bodyParser=require("body-parser"),cookieSession=require("cookie-session"),flash=require("express-flash"),{isClass:isClass}=require("utils/typecheck"),{WebViewBase:WebViewBase}=require("./webview");let globalRouters=[{name:"index",url:"/",view:"./views/index"},{name:"auth",url:"/auth",view:"./views/auth"}],GlobalCommonMiddleware=function(e){return(r,s,t)=>{r.server=e,r.storage=e.storage,r.eventbus=e.eventbus,t()}};class Webframework{constructor(e){this.settings=Object.assign({port:80,debug:!1,secret:"5cc91a885be749f99f17052112e8b31d",cookieName:"MEEYI_VIGSERVER"},R.pick(["port","secret","issuer","audience","debug","requireAuth","authMiddleware"],e)),this.views=[],this._init()}_init(){try{this.express=express(),this.router=express.Router(),this.express.use(this.router),this.express.engine("art",require("express-art-template")),this.express.set("views",path.join(__dirname,"templates")),this.express.set("view options",{debug:this.settings.debug,extname:".html"}),this._installMiddlewares(),this._registerRouters()}catch(e){logger.error(_("Error while initializing express:{message}").params(e.stack))}}_installMiddlewares(){let e=path.join(VIGConsts.VIGRootFolder,"webroot"),r=[{name:"common",param:GlobalCommonMiddleware(this)},{name:"favicon",param:favicon(path.join(e,"images","favicon.ico"))},{name:"bodyParserUrl.encoded",param:bodyParser.urlencoded({extended:!1})},{name:"bodyParserJson",param:bodyParser.json({type:"application/*+json"})},{name:"bodyParserText",param:bodyParser.text({type:"text/html"})},{name:"cookieParser",param:cookieParser()},{name:"cookieSession",param:cookieSession({name:this.settings.cookieName,secret:this.settings.secret})},{name:"static[path=webroot]",param:express.static(e)},{name:"static[path=data/upload]",param:express.static(path.join(VIGConsts.DataRootFolder,"upload"))},{name:"passport.initialize",param:passport.initialize()},{name:"passport.session",param:passport.session()},{name:"flash",param:flash()},{name:"log4js",param:log4js.connectLogger(log4js.getLogger())}];for(let e of r)try{this.registerMiddleware(e.param)}catch(r){logger.error(_("Error while initializing middleware {name}:{message}").params(e.name,r.stack))}}_registerRouters(){for(let e of globalRouters)this.registerRouter(e.url,e.view);VIGApps.registerWebsite(this.router),VIGServices.registerWebsite(this.router),VIGDevices.registerWebsite(this.router)}registerRouter(e,r){let s=[];Array.isArray(r)||(r=[r]);for(let t of r)if(t instanceof WebViewBase)s.push(t);else if("function"==typeof t)s.push(t);else if("string"==typeof t)try{let r=require(t);Array.isArray(r)?this.registerRouter(e,r):r instanceof WebViewBase?s.push(r):isClass(r)?s.push(new r):"function"==typeof r&&s.push(r)}catch(e){logger.debug(_("Error while register view {item}:{err}").params(String(t),e.message))}else isClass(t)&&s.push(new t);s.forEach(r=>{try{r instanceof WebViewBase?r.router&&this.router.use(e,r.router):"function"==typeof r&&this.router.use(e,r)}catch(r){logger.error(_("Error while register <{url}> router : {message}").params(e,r.stack))}})}registerMiddleware(){try{this.express.use(...arguments)}catch(e){logger.error(_("Error while register express middleware:{message}").params(e.stack))}}}module.exports=Webframework;