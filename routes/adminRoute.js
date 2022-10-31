const express=require('express');
const admin_route=express();

const session = require('express-session');
const config=require('../config/config');
const bodyparser=require('body-parser')
admin_route.use(bodyparser.json());
admin_route.use(bodyparser.urlencoded({extended:true}));
admin_route.set('view engine','ejs');
admin_route.set('views','./views/admin');
admin_route.use(session({secret:config.secretSession}));
const auth=require('../middleware/adminAuth');
const adminController=require('../controllers/adminController');


admin_route.get('/',auth.isLogout,adminController.adminLoginLoad)
admin_route.post('/',adminController.verifyLogin)
admin_route.get('/dashboard',auth.isLogin,adminController.dashboardLoad)
admin_route.get('/logout',auth.isLogin,adminController.Logout)

admin_route.get('*',function(req,res){
    res.redirect('/admin')
})
module.exports=admin_route;