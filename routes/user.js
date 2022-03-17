const express = require('express');
const router = express.Router();
const user = require('../models/user_model');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const { response } = require('../app');
require('dotenv').config(); 
const loginController = require('../controllers/loginController');
const registerController = require('../controllers/registerController');
const refreshTokenController = require('../controllers/refreshTokenController');
const logoutController = require('../controllers/logoutController');
const authRole = require('../middleware/authRoles');

const ROLES = require('../config/roles');
const authJWT = require('../middleware/authJWT');
console.log('users file')
router.post('/login',loginController.login)

router.post('/register',registerController.register);

router.get('/refreshtoken',refreshTokenController.refreshToken);

router.get('/logout',logoutController.logout);

router.get('/delete',authJWT,authRole(ROLES.Admin),(req,res)=>{
    console.log('you are an admin if you get this');
    res.status(200).json({
        message : 'you are an edmin if you get this'
    })
})

router.get('/edit',authJWT,authRole(ROLES.Admin,ROLES.Editor),(req,res)=>{
    console.log('you are an edit if you get this');
    res.status(200).json({
        message : 'you are an editor if you get this'
    })
})
router.get('/general',authJWT,authRole(ROLES.Admin,ROLES.Editor,ROLES.User),(req,res)=>{
    console.log('you are a general user if you get this');
    res.status(200).json({
        message : 'you are a general user if you get this'
    })
})

module.exports = router;