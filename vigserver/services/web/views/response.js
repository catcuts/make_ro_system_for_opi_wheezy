/*　China Fujian Huanyutong Technology Co., Ltd. */
const fs=require("fs"),artTemplate=require("art-template");async function renderTemplate(e="",t={}){e.endsWith(".art")||(e+=".art");let r=path.join(VIGConsts.VIGRootFolder,"services","web","templates",e),a=await new Promise(function(e,t){fs.readFile(r,"utf8",function(r,a){r?t(r):e(a)})});return artTemplate.render(a,t)}function TemplateView(e,t={}){return{__template__:e,context:t}}module.exports={TemplateView:TemplateView};