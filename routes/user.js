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



router.post('/login',loginController.login)

router.post('/register',registerController.register);

router.get('/refreshtoken',refreshTokenController.refreshToken);

router.get('/logout',logoutController.logout);

module.exports = router;