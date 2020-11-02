const express = require("express"); 
const router = express.Router(); 
const controller = require("./controller"); 
const { verify } = require('../middlewares'); 
/* Public routes */
router.post('/login', controller.loginHandler);
router.post('/signup', controller.signupHandler);
/* Private routes */
router.post('/update', verify, controller.updateHandler);
router.get('/all', controller.getAllHandler);
router.get('/:id', controller.getProfileHandler);
module.exports = router; 
