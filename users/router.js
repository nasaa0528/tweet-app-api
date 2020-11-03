const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { verify } = require('../middlewares');

router.get('/', verify, controller.getAllUsersHandler);

module.exports = router; 
