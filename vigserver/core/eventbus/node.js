/*　China Fujian Huanyutong Technology Co., Ltd. */
const assert=require("assert"),{MessageType:MessageType,NormalMessage:NormalMessage,BroadcastMessage:BroadcastMessage,SubjectMessage:SubjectMessage,NotifyMessage:NotifyMessage,ErrorMessage:ErrorMessage}=require("./message");class Node{constructor(s,e){assert(s.length>0,_("Eventbus node <{name}> is not ready").params(this.name)),this.__EVENTBUS_NODE__=!0,this._subjects=[],this.options=Object.assign({pulse:!1,broadcast:!0},e||{}),this.name=s,this.eventbus=VIGEventbus,this.ready=!1,this._context=this}get context(){return this._context||this}set context(s){this._context=s}_assertReady(){assert.equal(this.ready,!0,_("Eventbus node <{name}> is not ready").params(this.name))}connect(){this.eventbus.connect(this),this.ready=!0}disconnect(){this._assertReady(),this.unsubscribeAll(),this.eventbus.disconnect(this),this.ready=!1}async onMessage(s){}async onError(s){}async onPulse(){}async onBroadcast(s){}onNotify(s){}async send(s,e){return this._assertReady(),await this.eventbus.send.call(this.eventbus,NormalMessage({from:this.name,to:s,payload:e}))}async broadcast(s){this._assertReady(),await this.eventbus.broadcast(BroadcastMessage({from:this.name,payload:s}))}notify(s,e={}){try{this.eventbus.notify(NotifyMessage({from:this.name,event:s,...e}))}catch(s){}}publish(s,e){this._assertReady(),this.eventbus.publish(s,SubjectMessage({from:this.name,subject:s,payload:e}))}subscribe(s){this._assertReady(),-1===this._subjects.indexOf(s)&&(this.eventbus.subscribe(this,s),this._subjects.push(s))}unsubscribe(s){this._assertReady();try{this.eventbus.unSubscribe(this,s),this._subjects.splice(this._subjects.indexOf(s),1)}catch(s){}}unsubscribeAll(){this._assertReady(),this.eventbus.unSubscribeAll(this),this._subjects=[]}error(s,e={}){this.publish(this.name+".error",{from:this.name,error:s,timestamp:(new Date).getTime(),...e})}catch(s){let e="string"==typeof s?s:s.name;this.subscribe(e,this.onError)}}module.exports=Node;