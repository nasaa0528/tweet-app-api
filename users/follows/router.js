const express = require('express');
const router = express.Router(); 
const controller = require('./controller');
const {verify} = require('../../middlewares');

router.get('/follow', verify, controller.followHandler);
router.get('/unfollow', verify, controller.unfollowHandler);
router.get('/followers', verify, controller.followersHandler);
router.get('/following', verify, controller.followingHandler); 

module.exports = router;
