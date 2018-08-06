/*　China Fujian Huanyutong Technology Co., Ltd. */
const{ELFHash:ELFHash}=require("utils/hash"),{DocumentRecord:DocumentRecord}=require("core/storage"),assert=require("assert"),{cloneJson:cloneJson}=require("utils/jsonfuncs"),TransactionStorageName="transactions";function generateTid(){return ELFHash(VIGateway.sn+(new Date).getTime()+parseInt(100*Math.random()))}const TransactionStatus={Unloaded:-1,Initial:0,Progressing:1,Pause:2,End:10,Timeout:11,Abort:12,Ignore:13,Error:99};class Transaction extends DocumentRecord{constructor(t={}){super(),this.storageName=TransactionStorageName,this.storagePrimaryKey="id",this.attrs={id:generateTid(),name:t.name||"",source:t.source||"",description:t.description||"",type:t.type,status:TransactionStatus.Unloaded,createTime:(new Date).getTime(),nodes:[],options:Object.assign({maxLife:20},t)}}get id(){return this.attrs.id||0}get status(){return this.attrs.status||0}get nodes(){return this.attrs.nodes||[]}get source(){return this.attrs.source||""}get options(){return this.attrs.options||{}}async isComplete(){if(this.attrs.status>1)return!0;if(this.attrs.createTime){let t=this.attrs.options.maxLife||20;if((new Date).getTime()-this.attrs.createTime>60*t*1e3)return await this.timeout(),!0}return!1}async load(t){void 0===t?t=this.id:this.attrs.id=t;try{await super.load(t)}catch(t){this.attrs.status=-1}}async loadByQuery(t){try{await super.loadByQuery(t)}catch(t){this.attrs.status=-1}}async save(){let t=await VIGStorage.getDocument(this.storageName);try{let e=cloneJson(this.attrs);if(-1===e.status)e.status=0,e.createTime=(new Date).getTime(),this.attrs=await t.insert(e);else{let a=await t.update({id:this.id},{$set:e},{returnUpdatedDocs:!0});if(!(a.length>0))throw new Error(_("Transaction <{id}> not saved.").params(this.id));this.attrs=a[0]}}catch(t){throw logger.error(_("Error while save transaction[{id}] : {err}").params(this.id,t)),t}}_assertReady(){assert(this.status<TransactionStatus.Initial,"Transaction is not initialized or load")}_assertIsEnd(){assert(2===this.status,"Transaction <{id}> is over".params(this.id))}update(t={}){delete t.nodes,delete t.status,Object.assign(this.attrs,t,{updateTime:(new Date).getTime()})}outThrottle(t=0){return 0!==t&&this.attrs.updateTime<new Date-1e3*t}async addNode({actor:t="",message:e="",trigger:a="",direction:s=0,progress:r=0,result:i="",name:n="",params:o={}}={}){void 0!==this.attrs.nodes&&0!==this.attrs.nodes.length||(this.attrs.status=TransactionStatus.Progressing),this.attrs.updateTime=(new Date).getTime(),this.attrs.nodes.push({datetime:(new Date).getTime(),actor:t,trigger:a,message:e,progress:r,result:i,name:n,params:o}),await this.save()}get last(){return 0===this.attrs.nodes.length?null:this.attrs.nodes[this.attrs.nodes.length-1]}get first(){return 0===this.attrs.nodes.length?null:this.attrs.nodes[0]}async end(t=""){this.attrs.status=TransactionStatus.End,this.attrs.endTime=(new Date).getTime(),this.attrs.summary=t,await this.save()}async abort(t=""){this.attrs.status=TransactionStatus.Abort,this.attrs.endTime=(new Date).getTime(),this.attrs.summary=t,await this.save()}async timeout(t=""){this.attrs.status=TransactionStatus.Timeout,this.attrs.endTime=(new Date).getTime(),this.attrs.summary=t,await this.save()}async ignore(t=""){this.attrs.status=TransactionStatus.Ignore,this.attrs.endTime=new Date,this.attrs.summary=t,await this.save()}async destory(){let t=await VIGStorage.getDocument(this.storageName);try{await t.remove({id:this.id}),this.attrs={id:0,status:-1}}catch(t){throw logger.error(_("Error while destory transaction[{id}] : {err}").params(this.id,t.message)),t}}}class TransactionManager{static async get(t){let e=new Transaction;return await e.load(t),e}static async find(t){let e=await VIGStorage.getDocument(TransactionStorageName);return await e.find(t)}static async findOne(t){let e=await VIGStorage.getDocument(TransactionStorageName),a=await e.findOne(t);if(a){let t=new Transaction;return t.update(a),t}return null}static async create(t={}){let e=new Transaction(t);return await e.save(),e}static async delete(t){let e=await VIGStorage.getDocument(TransactionStorageName);await e.remove({id:t})}async onMessage(t,e={}){let a=1e3*(void 0===e.throttle?0:e.throttle),s=(this.getTransaction(t.tid,a),await VIGStorage.getDocument(TransactionStorageName));await s.findOne({id:id,updateTime:{$lte:(new Date).getTime()-a}})}}function triggerEventTransaction(t,e={}){if(void 0===t.tid||0===t.tid){let a=e.events||[];"string"==typeof a&&a.includes(",")&&(a=a.split(",")),(a.includes(t.payload.code)||a.includes("*"))&&(t.tid=generateTid())}}module.exports={generateTid:generateTid,triggerEventTransaction:triggerEventTransaction,Transaction:Transaction,TransactionManager:TransactionManager};