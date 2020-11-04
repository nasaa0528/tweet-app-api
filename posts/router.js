const express = require('express');
const router = express.Router();
const controller = require('./controller');
const {verify} = require('../middlewares');

router.post('/add', verify, controller.addPostHandler);
router.get('/', verify, controller.postsHandler);
router.get('/myposts', verify, controller.myPostsHandler);
module.exports = router; 
