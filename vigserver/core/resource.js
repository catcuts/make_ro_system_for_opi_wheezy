/*　China Fujian Huanyutong Technology Co., Ltd. */
class ResourceManager{constructor(e){this.root=e}get(e){return fs.existsSync(e)?e:path.join(this.root,resname)}add(e){}}moudles.exports=ResourceManager;