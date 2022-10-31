const express=require('express')
const user_route=express();
const userController=require('../controllers/userController')
user_route.set('view engine','ejs');
user_route.set('views','./views/users');
const bodyparser=require('body-parser');
user_route.use(bodyparser.urlencoded({extended:false}))
user_route.use(bodyparser.json());
const path=require('path')
const auth=require('../middleware/auth')
const config=require('../config/config')
const session=require('express-session')
user_route.use(session({secret:config.secretSession}));
const multer=require('multer');

const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname,'../public/userImages'))
    },
    filename:function(req,file,cb ){
const name=Date.now()+"-"+file.originalname;
cb(null,name)
    },

})
const upload=multer({storage:storage});

user_route.get("/register",auth.isLogout,userController.loadRegister)
user_route.post("/register",upload.single('image'),userController.userInsert)
user_route.get('/verify',userController.verifymail);
user_route.get('/login',auth.isLogout,userController.loadLogin);
user_route.get('/',auth.isLogout,userController.loadLogin);

user_route.post('/login',userController.verifyLogin)
user_route.get('/home',auth.isLogin,userController.loadHome)
user_route.get('/logout',auth.isLogin,userController.userLogout);
user_route.get('/forget',auth.isLogout,userController.forgetLoad);
user_route.post('/forget',userController.forgetVerifymail);
user_route.get('/forget-password',auth.isLogout,userController.forgetPasswordload)
user_route.post('/forget-password',userController.resetPassword);


module.exports= user_route
