const helper = require('../utils/helpers.js'); 
const config = require('../utils/config.js'); 
const db = config.db; 

const addPostHandler = async (req, res, next) => {
  console.log(req.user);
  res.send(req.body);
};

module.exports = {
  addPostHandler
}
