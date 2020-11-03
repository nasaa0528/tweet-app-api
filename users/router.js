const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { verify } = require('../middlewares');

/* Public routes */
router.post('/login', controller.loginHandler);
router.post('/signup', controller.signupHandler);
/* Private routes */
router.post('/update', verify, controller.updateHandler);
router.get('/me', verify, controller.getProfileHandler);
router.get('/:id', verify, controller.getUserHandler)
router.get('/', verify, controller.getAllUsersHandler);

module.exports = router; 
