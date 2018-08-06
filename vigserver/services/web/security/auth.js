/*　China Fujian Huanyutong Technology Co., Ltd. */
let passport=require("passport"),LocalStrategy=require("passport-local").Strategy,crypto=require("crypto"),PassPortJWT=require("passport-jwt"),jsonwebtoekn=require("jsonwebtoken");function createPassword(e){let s=crypto.createHmac("sha1",VIGateway.secret);return s.update(e),s.digest().toString("base64")}function verifyPassword(e,s){let r=crypto.createHmac("sha1",VIGSettings.secret);return r.update(s),r.digest().toString("base64")===e}function generateApiToken(e){let s={issuer:VIGConsts.ISSUER,audience:VIGConsts.AUDIENCE},r=VIGateway.Attrs.api.expiresIn||"1h";return r&&(s.expiresIn=r),jsonwebtoekn.sign({username:e},VIGateway.Attrs.secret,s)}async function resetPassword(e,s){let r=await VIGStorage.openDocument("users");await r.update({name:e},{password:createPassword(s)})}passport.use("basic",new LocalStrategy(function(e,s,r){VIGStorage.openDocument("users").then(async t=>{t.document.findOne({name:e},function(e,t){return e?r(e):t?verifyPassword(t.password,s)?t.enabled?r(null,t):r(null,!1,{message:_("The account is disabled.")}):r(null,!1,{message:_("Incorrect password.")}):r(null,!1,{message:_("Incorrect username.")})})})})),passport.serializeUser(function(e,s){s(null,e)}),passport.deserializeUser(function(e,s){s(null,e)}),passport.use("api",new PassPortJWT.Strategy({jwtFromRequest:PassPortJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),secretOrKey:VIGateway.attrs.secret,issuer:VIGConsts.ISSUER,audience:VIGConsts.AUDIENCE,session:!1},function(e,s){return s(null,e.username)})),module.exports={createPassword:createPassword,verifyPassword:verifyPassword,generateApiToken:generateApiToken,resetPassword:resetPassword};