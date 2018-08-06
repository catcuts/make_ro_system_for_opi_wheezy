/*　China Fujian Huanyutong Technology Co., Ltd. */
let jsonpath=require("jsonpath"),deepMerge=require("deep-extend"),{isJson:isJson}=require("./typecheck");function extractJsonItems(e,n=[],t=!1){let s={};for(let r in e)n.includes(r)?s[r]=e[r]:"object"==typeof t&&r in t?s[r]=t[r]:!1!==t&&(s[r]=t);return s}function diffJsonItems(e,n,t=!1,s=!1){let r={};for(let t in n)t in e?n[t]!==e[t]&&(r[t]=n[t]):s||(r[t]=n[t]);return t?R.keys(r):r}function getValueByKeys(json,keys){let result=eval("json."+keys)}function filterJsonByKeys(e,n,t=!1){let s={};for(let r in e)t?n.includes(r)||(s[r]=e[r]):n.includes(r)&&(s[r]=e[r]);return s}function cloneJson(e){return JSON.parse(JSON.stringify(e))}function diffJson(e,n){let t={};for(let s in n)s in e&&n[s]!==e[s]&&(t[s]={value:n[s],oldValue:e[s]});return t}function updateJson(e,n,t,s=0){try{return jsonpath.apply(e,n,e=>{let n=e;return Array.isArray(n)?0===s?n=t:1===s?n.push(t):n.unshift(t):n=isJson(n)&&0===s&&isJson(t)?deepMerge(n,t):t,n}),e}catch(n){return e}}function queryJson(e,n,t){try{return jsonpath.value(e,n)}catch(e){return t}}module.exports={extractJsonItems:extractJsonItems,diffJsonItems:diffJsonItems,filterJsonByKeys:filterJsonByKeys,cloneJson:cloneJson,updateJson:updateJson,queryJson:queryJson};