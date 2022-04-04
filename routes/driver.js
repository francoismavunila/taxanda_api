const express = require('express');
const router = express.Router();
const driver = require('../models/driver_model');
const { response } = require('../app');
const Driveregistration = require('../controllers/driverRegistration');

const authRole = require('../middleware/authRoles');



router.post('/registration',Driveregistration.registration);



module.exports = router;