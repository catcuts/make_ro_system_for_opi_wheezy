/*　China Fujian Huanyutong Technology Co., Ltd. */
function formatVampMessage(e){try{let t=[1,1,4,4,2,1,1,1],a=12,o=["header","type","from","to","sid","flags","roaming","payloadLength"],r=[],s=0;r.push(e.slice(0,12).toString("hex")+" ");for(let n=0;n<t.length;n++)r.push(o[n]+"="+e.slice(a+s,a+s+t[n]).toString("hex")),s+=t[n];return r.push("payload="+e.slice(a+s).toString("hex")),r.join(",")}catch(t){return e.toString("hex")}}module.exports={formatVampMessage:formatVampMessage};
//# sourceMappingURL=/home/wxzhang/Work/Code/workspace/vigserver/src/server/utils/vamputils.js.map