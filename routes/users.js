const express = require("express"); 
const router = express.Router(); 

/* Public routes */
router.post('/login', (req, res, next) => {
  res.json(req.body); 
});

router.post('/signup', (req, res, next) => {
  res.json(req.body); 
});

module.exports = router; 
