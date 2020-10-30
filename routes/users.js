const express = require("express"); 
const router = express.Router(); 

/* Public routes */
router.post('/login', (req, res, next) => {
  res.json(req.body); 
});

router.post('/signup', (req, res, next) => {
  res.json(req.body); 
});

router.post('/update', (req, res, next) => {
  res.json(req.body); 
});

router.get('/all', (req, res, next) => {
  res.send("All users must be retrieved here!"); 
});

router.get('/:id', (req, res, next) => {
  res.send(req.params.id); 
});
module.exports = router; 
