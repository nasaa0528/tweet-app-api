const express = require("express"); 
const router = express.Router(); 
const controller = require("./controller")

/* Public routes */
router.post('/login', controller.loginHandler);
router.post('/signup', controller.signupHandler);
router.post('/update', controller.updateHandler);
router.get('/all', controller.getAllHandler);
router.get('/:id', controller.getProfileHandler);
module.exports = router; 
