/*　China Fujian Huanyutong Technology Co., Ltd. */
let passport=require("passport"),express=require("express"),generateApiToken=require("services/httpserver/security/auth").generateApiToken,router=express.Router();router.route("/login").get(function(e,r,t){if(e.isAuthenticated()){let t=e.query.next_url||"/";r.redirect(t)}else r.render("login.art")}).post(passport.authenticate("basic"),function(e,r){if(e.query.api)r.send(generateApiToken("admin"));else{let t=e.query.next_url||"/";r.redirect(t)}}),router.all("/logout",function(e,r,t){e.logout();let o=e.query.next_url||"/";r.redirect(o)}),router.get("/forgetpassword",function(e,r,t){}),router.get("/changepassword",function(e,r,t){}),module.exports=router;