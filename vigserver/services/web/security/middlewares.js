/*　China Fujian Huanyutong Technology Co., Ltd. */
let passport=require("passport");function verifyAuthenticatedMiddleware(e,i,t){if(e.isAuthenticated())return t();i.redirect("/login")}let CommonAuthMiddleware=passport.authenticate("basic",{successRedirect:"/",successFlash:"Welcome!",failureRedirect:"/login",failureFlash:"Invalid username or password."}),ApiAuthMiddleware=passport.authenticate("api");function DeviceAuthMiddleware(e,i,t){return t()}module.exports={verifyAuthenticatedMiddleware:verifyAuthenticatedMiddleware,CommonAuthMiddleware:CommonAuthMiddleware,ApiAuthMiddleware:ApiAuthMiddleware,DeviceAuthMiddleware:DeviceAuthMiddleware};