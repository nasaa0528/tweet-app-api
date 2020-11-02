const express = require("express"); 
const router = express.Router(); 
const controller = require("./controller"); 
const { verify } = require('../middlewares'); 
/* Public routes */
router.post('/login', controller.loginHandler);
router.post('/signup', controller.signupHandler);
/* Private routes */
router.post('/update', verify, controller.updateHandler);
router.get('/all/:page', verify, controller.getAllHandler);
router.get('/', controller.getProfileHandler);
router.get('/:id', controller.getUserHandler)
module.exports = router; 
