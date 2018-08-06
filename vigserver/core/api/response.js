/*　China Fujian Huanyutong Technology Co., Ltd. */
const express=require("express"),co=require("co"),isGeneratorFunction=require("../../utils/asyncutil").isGeneratorFunction;class ApiResourceBase{constructor(){this.name="",this.title="",this.description="",this.router=express.Router(),this.settings(),this.router.get("/",this.asyncMethodWrapper(this.get)).get("/:id/",this.asyncMethodWrapper(this.get)).post("/",this.asyncMethodWrapper(this.post)).post("/:id",this.asyncMethodWrapper(this.post)).delete("/",this.asyncMethodWrapper(this.delete)).delete("/:id",this.asyncMethodWrapper(this.delete)).put("/",this.asyncMethodWrapper(this.put)).put("/:id",this.asyncMethodWrapper(this.put)).patch("/:id",this.asyncMethodWrapper(this.put)).head("/:id",this.asyncMethodWrapper(this.head))}settings(){}injectParentResource(e,t,s){let r=new function(){};if("id"in e.params?r.id=e.params.id||"":r.id="",r.name=this.topic,e.parentResource){let t=e.parentResource;e.parentResource=r,e.parentResource.parentResource=t}else e.parentResource=r;s()}registerResource(e,t=!1){t?this.router.use("/:id/"+e.topic,this.asyncMethodWrapper(this.injectParentResource),this.asyncMethodWrapper(e.router)):this.router.use("/"+e.topic,this.asyncMethodWrapper(this.injectParentResource),this.asyncMethodWrapper(e.router))}ResourceQuery(e){let t={};return t="get"==e.method?{id:e.params.id||"",filter:e.query._filter||"",paging:e.query._paging||!1,pageSize:e.query._pageSize||20,pageNum:e.query._pageNum||1,pageCount:e.query._pageCount||1,sortKey:e.query._sortKey||"",sortOrder:e.query._sortOrder||""}:{id:e.params.id||"",filter:e.body._filter||"",paging:e.body._paging||!1,pageSize:e.body._pageSize||20,pageNum:e.body._pageNum||1,pageCount:e.body._pageCount||1,sortKey:e.body._sortKey||"",sortOrder:e.body._sortOrder||""}}asyncMethodWrapper(e){return(t,s,r)=>{if(isGeneratorFunction(e))co(e.call(this,t,s,r)).then(e=>{s.json(e).end()}).catch(e=>{s.json(ErrorApiResponse(e.message)).end()});else try{s.json(e.call(this,t,s,r))}catch(e){s.json(ErrorApiResponse(e.message)).end()}}}*get(e,t,s){return"id"in e.params?this.asyncMethodWrapper(this.one)(e,t,s):this.asyncMethodWrapper(this.list)(e,t,s)}post(e,t,s){return"id"in e.params?this.asyncMethodWrapper(this.create)(e,t,s):this.asyncMethodWrapper(this.batchCreate)(e,t,s)}put(e,t,s){return"id"in e.params?this.asyncMethodWrapper(this.update)(e,t,s):this.asyncMethodWrapper(this.batchUpdate)(e,t,s)}patch(e,t,s){return"id"in e.params?this.asyncMethodWrapper(this.update)(e,t,s):NotSupportedApiResponse()}delete(e,t,s){return"id"in e.params?this.asyncMethodWrapper(this.destroy)(e,t,s):this.asyncMethodWrapper(this.batchDestroy)(e,t,s)}head(e,t,s){return this.asyncMethodWrapper(this.meta)(e,t,s)}list(e,t,s){return NotSupportedApiResponse()}one(e,t,s,r){return NotSupportedApiResponse()}create(e,t,s){return NotSupportedApiResponse()}batchCreate(e,t,s){return NotSupportedApiResponse()}update(e,t,s){return NotSupportedApiResponse()}batchUpdate(e,t,s){}destroy(e,t,s){return NotSupportedApiResponse()}batchDestroy(e,t,s){return NotSupportedApiResponse()}meta(e,t,s){return NotSupportedApiResponse()}toString(){return"ApiResource"}}function ApiResponse(e,t,s){return{status:e,message:t||"",payload:s||{}}}function SuccessApiResponse(e,t=""){return ApiResponse(200,t,e)}function RedirectApiResponse(e,t=""){return ApiResponse(300,t,e||{})}function FailApiResponse(e,t=""){return ApiResponse(400,t,e||{})}function DeniedApiResponse(e){return ApiResponse(401,"Permission denied.",e||{})}function NotSupportedApiResponse(e){return ApiResponse(404,"Not supported or implemented.",e||{})}function ErrorApiResponse(e,t=""){return ApiResponse(500,t,e||{})}module.exports={ApiResponse:ApiResponse,SuccessApiResponse:SuccessApiResponse,RedirectApiResponse:RedirectApiResponse,FailApiResponse:FailApiResponse,DeniedApiResponse:DeniedApiResponse,NotSupportedApiResponse:NotSupportedApiResponse,ErrorApiResponse:ErrorApiResponse};