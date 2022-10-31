const mongoose=require('mongoose');
mongoose.connect("mongodb://127.0.0.1:27017/userManagementSystemDB");
const express=require('express');
const app=express();
const port=process.env.PORT||3000

app.use(express.static('public'))

const userRoutes=require('./routes/userRoutes')
const adminRoute=require('./routes/adminRoute')
app.use('/',userRoutes);

app.use('/admin',adminRoute);


app.listen(port,()=>{
    console.log(`server is running at the port number ${port}`)
});