const express = require('express');
const router = express.Router();
const controller = require('./controller');
const {verify} = require('../middlewares');

router.post('/add', verify, controller.addPostHandler); 
module.exports = router; 
