/*　China Fujian Huanyutong Technology Co., Ltd. */
const hprose=require("hprose"),monitorUrl="http://127.0.0.1:7001";module.exports=function(t){t.command("host","show current host attrs").option("-n, --name <name>","Specify the attr name").action(async function(t,o){let n=new hprose.HttpClient(monitorUrl,["host"]),e=parseInt(t.options.name);try{let t=await n.host(e);this.log(t)}catch(t){this.log("VIGServer may not be running,cannot read mode")}})};