const express = require('express');
const config = require('../config/config')
const User = require('../models/userModels')
const bcrypt = require('bcrypt');


const adminLoginLoad = async (req, res) => {
    try {
        res.render('login');
    } catch (error) {
        console.log(error.message)
    }
}

const verifyLogin = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const userData = await User.findOne({ email: email });
    if (userData) {
        const passMatch = await bcrypt.compare(password, userData.password);
        if (passMatch) {
            if (userData.is_admin === 0) {
                res.render('login', { message: 'Email and Password are incorrect..?' })

            } else {
                req.session.user_id = userData._id;
                res.redirect('/admin/dashboard');
            }


        } else {
            res.render('login', { message: 'Email and Password are incorrect..?' })

        }

    } else {
        res.render('login', { message: 'Email and Password are incorrect..?' })
    }
}

const dashboardLoad = async (req, res) => {
    try {
        res.render('dashboard')
    } catch (error) {
        console.log(error.message)
    }
}


//logout code

const Logout = async (req, res) => {
    try {
        req.session.destroy();
        res.redirect('/admin');

    } catch (error) {
        console.log(error.message)
    }
}


module.exports = {
    adminLoginLoad,
    verifyLogin,
    dashboardLoad,
    Logout

}