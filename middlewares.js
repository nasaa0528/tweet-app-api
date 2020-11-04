const jwt = require('jsonwebtoken')
const config = require('./utils/config');
const jwt_config = config.jwt_config;
exports.verify = function(req, res, next){
  let accessToken = req.headers['x-access-token'] || req.headers['authorization'];
  if (!accessToken){
    return res.status(403).json({"msg": "Unauthorized source"});
  }
  if (accessToken.startsWith('Bearer ')) {
    accessToken = accessToken.slice(7, accessToken.length);
  }
  let payload
  try{
    payload = jwt.verify(accessToken, jwt_config.secret);
    req.user = payload;
    next();
  }
  catch(e){
    return res.status(401).send("Unauthorized user");
  }
}
