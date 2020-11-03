const express = require('express');
const router = express.Router();
const controller = require('./controller');
const {verify} = require('../middlewares');

router.post('/add', verify, controller.addPostHandler); 
router.get('/:id', verify, controller.postsHandler); 
module.exports = router; 
