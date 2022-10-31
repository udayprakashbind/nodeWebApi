const express = require('express');
const config=require('../config/config')
const User = require('../models/userModels')
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');

const randomstring = require('randomstring');

const loadRegister = async (req, res) => {
    try {
       
        res.render('registrations');


    } catch (error) {
        console.log(error.message);
    }
}



const securePassword = async (password) => {
    try {
        const hashPassword = await bcrypt.hash(password, 10);
        return hashPassword;

    } catch (error) {
        console.log(error.message)
    }
}
//sent mail code
const sendverifymail = async (name, email, user_id) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user:config.userEmail,
                pass: config.emailPass
            }

        });
        const mailOption = {
            from:config.userEmail,
            to: email,
            subject: 'For verify email',
            html: 'hello ' + name + ' please click here <a href="http://localhost:3000/verify?id=' + user_id + '"> verify</a> your email'
        }
        transporter.sendMail(mailOption, function (error, info) {
            if (error) {
                console.log(error)
            } else {
                console.log('Email has been sent', info.response)
            }
        })

    } catch (error) {
        console.log(error.message)
    }

}

//user registration code
const userInsert = async (req, res) => {
    try {
        const spassword = await securePassword(req.body.password);
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mobile,
            image: req.file.filename,
            password: spassword,
            is_admin: 0,

        });
        const userData = await user.save();
        if (userData) {
            sendverifymail(req.body.name, req.body.email, userData._id)
            res.render('registrations', { message: "your registration are succufully , please check your mail and verify your email" })
        } else {
            res.render('registrations', { message: "your registration are failled" })

        }

    } catch (error) {
        console.log(error.message)
    }
}
//verify email code
const verifymail = async (req, res) => {

    try {

        const updateInfo = await User.updateOne({ _id: req.query.id }, { $set: { is_verified: 1 } });
        console.log(updateInfo);
        res.render('email-verified')

    } catch (error) {
        console.log(error.message)
    }
}

//login code

const loadLogin = async (req, res) => {
    try {
        res.render('login');


    } catch (error) {
        console.log(error.message);
    }
}
const verifyLogin = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const userData = await User.findOne({ email: email });
        if (userData) {

            const passMatch = await bcrypt.compare(password, userData.password)
            if (passMatch) {

                if (userData.is_verified === 0) {
                    res.render('login', { message: 'please verified your email' })
                } else {
                    req.session.user_id = userData._id;
                    res.redirect('/home')
                }

            } else {
                res.render('login', { message: 'Please enter correct email and password' })

            }

        } else {
            res.render('login', { message: 'Please enter correct email and password' })
        }

    } catch (error) {
        console.log(error.message)
    }
}
//user dashboard

const loadHome = async (req, res) => {
    try {
        res.render('home');


    } catch (error) {
        console.log(error.message);
    }
}

//logout code

const userLogout = async (req, res) => {
    try {
        req.session.destroy();
        res.redirect('/');

    } catch (error) {
        console.log(error.message)
    }
}

//forget password code
const forgetLoad = async (req, res) => {
    try {
        res.render('forget');
    } catch (error) {
        console.log(error.message)
    }
}


//send mail for reset password code

const resetPasswordmail = async (name, email, token) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user:config.userEmail,
                pass: config.emailPass
            }

        });
        const mailOption = {
            from:config.userEmail,
            to: email,
            subject: 'Reset your Password',
            html: 'hello ' + name + ' please click here <a href="http://localhost:3000/forget-password?token=' + token + '"> Reset</a> your password'
        }
        transporter.sendMail(mailOption, function (error, info) {
            if (error) {
                console.log(error)
            } else {
                console.log('Email has been sent', info.response)
            }
        })

    } catch (error) {
        console.log(error.message)
    }

}


    const forgetVerifymail = async (req, res) => {
             const email = req.body.email

    try {
        const userData = await User.findOne({ email: email});
        if (userData) {
            if (userData.is_verified===0) {
                res.render('forget', { message: 'please verify your email' })

            } else {
                const randomString = randomstring.generate();
                const updateData = await User.updateOne({email:email}, { $set:{ token: randomString } })
                resetPasswordmail(userData.name,userData.email,randomString);
                res.render('forget', { message: 'please check your mail for reset your password' })

          }
        } else {
            res.render('forget',{ message: 'your email is not correct' })
        }

    } catch (error) {
        console.log(error.message)
    }
}
const forgetPasswordload=async(req,res)=>{
    try {
        const token=req.query.token;
        const tokenData=await User.findOne({token:token});
        if(tokenData){
            res.render('forget-password',{user_id:tokenData._id})

        }else{
            res.render('404',{message:'token is invalid...'})
        }

    } catch (error) {
        console.log(error.message)
    }
}
const resetPassword=async(req,res)=>{
    const password=req.body.password;
    const user_id=req.body.user_id
    const secure_password=await securePassword(password)
    const updateData=await User.findByIdAndUpdate({_id:user_id},{$set:{password:secure_password,token:''}});
    res.redirect('/');
}

module.exports = {
    loadRegister,
    userInsert,
    verifymail,
    loadLogin,
    verifyLogin,
    loadHome,
    userLogout,
    forgetLoad,
    forgetVerifymail,
    forgetPasswordload,
    resetPassword
}