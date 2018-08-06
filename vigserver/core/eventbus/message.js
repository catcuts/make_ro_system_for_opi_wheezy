/*　China Fujian Huanyutong Technology Co., Ltd. */
const MessageType={Normal:0,Broadcast:1,Subject:2};function Message({type:e=0,from:s="",to:a="",subject:t="",payload:r={},sid:o=0}={}){let g={from:s,to:a,sid:o,timestamp:(new Date).getTime(),payload:r};return t&&(g.subject=t),g}function NormalMessage({...e}={}){return Message({type:MessageType.Normal,...e})}function BroadcastMessage({...e}={}){return Message({type:MessageType.Broadcast,...e})}function SubjectMessage({subject:e="",...s}={}){return Message({type:MessageType.Subject,subject:"",...s})}function NotifyMessage({from:e="",event:s="",message:a="",...t}={}){return{from:e,event:s,message:a,timestamp:(new Date).getTime(),...t}}function ErrorMessage({from:e="",error:s=null,...a}={}){return{from:e,error:s,timestamp:(new Date).getTime(),...a}}module.exports={MessageType:MessageType,Message:Message,NormalMessage:NormalMessage,BroadcastMessage:BroadcastMessage,SubjectMessage:SubjectMessage,NotifyMessage:NotifyMessage,ErrorMessage:ErrorMessage};