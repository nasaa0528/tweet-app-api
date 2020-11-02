const jwt = require('jsonwebtoken'); 
const helper = require('../utils/helpers.js');  
const dbConfig = require('../utils/config.js'); 
const bcrypt = require('bcrypt');

const jwt_config ={ "secret": "49a44cbeaa62456326b905c0abab43ec" };
const db = dbConfig.db;


const loginHandler = async (req, res, next) => {
  const usernameEmail = req.body.usernameEmail; 
  const password = req.body.password;
  var userId;
  var passwordHash;
  var username;
  var jwtToken;
  var fullname; 
  var avatar;
  var snapshot

  const isEmail = helper.isEmail(usernameEmail); 
  const userRef = db.collection("users"); 

  try {
    if (!helper.parser(usernameEmail, password)) {
      return res.json({ "msg": "Login name/email or Password field cannot be empty!" });
    }

    if (isEmail) {
      snapshot = await userRef.where('email', '==', usernameEmail).get(); 
    } else {
      snapshot = await userRef.where('username', '==', usernameEmail).get(); 
    }

    if (helper.isItOnlyOne(snapshot)){
      snapshot.forEach((doc) => {
        userId = doc.id;
        username = doc.data().username;
        fullname = helper.nameConcat(doc.data().firstname, doc.data().lastname);
        avatar = doc.data().avatar;
        passwordHash = doc.data().hash;
      });
    } else {
      return res.json({ "msg": `Login name: ${usernameEmail} is not found!` }); 
    }

    if (bcrypt.compareSync(password, passwordHash)){
      const token = jwt.sign({ id: userId, name: fullname, usr: username, avt: avatar }, jwt_config.secret, { expiresIn: '7d' });
      return res.json({token, msg: "Successfully authenticated"}); 
    } else {
      return res.status(401).json({'status': 'Unauthorized user', 'msg': 'Incorrect password'});  
    }
  } 
  catch (err) {
    let {status, statusTxt, data} = err; 
    if (!status) {
      status = 500; 
      statusTxt = err.message; 
      data = err; 
    }
    res.status(status).json(data); 
  };
}

const signupHandler = (req, res, next) => {
  res.json(req.body); 
}; 

const updateHandler = (req, res, next) => {
  res.json(req.body); 
};

const getAllHandler = (req, res, next) => {
  res.send("All users must be retrieved here!"); 
};

const getProfileHandler = (req, res, next) => {
  res.send(req.params.id); 
}

module.exports = {
  loginHandler, 
  signupHandler, 
  updateHandler, 
  getAllHandler, 
  getProfileHandler
}
