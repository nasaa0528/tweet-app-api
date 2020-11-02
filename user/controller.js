const jwt = require('jsonwebtoken'); 
const helper = require('../utils/helpers.js');  
const config = require('../utils/config.js'); 
const bcrypt = require('bcrypt');

//const jwt_config ={ "secret": "49a44cbeaa62456326b905c0abab43ec" };
const db = config.db;
const jwt_config = config.jwt_config; 

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

  try {
    if (!helper.usernameParser(usernameEmail)) {
      throw {'status': 400, 'statusTxt': 'Empty username' , "data": "Login name/email field cannot be empty!" };
    }

    if (!helper.passwordParser(password)) {
      throw {'status': 400, 'statusTxt': 'Empty password', "data": "Password field cannot be empty!" };
    }

    const isEmail = helper.isEmail(usernameEmail); 
    const userRef = db.collection("users"); 
  
    if (isEmail) {
      snapshot = await userRef.where('email', '==', usernameEmail).get(); 
    } else {
      snapshot = await userRef.where('username', '==', usernameEmail).get(); 
    }

    if (helper.isItOnlyOne(snapshot)){
      const doc = snapshot.docs[0];
        userId = doc.id;
        username = doc.data().username;
        fullname = helper.nameConcat(doc.data().firstname, doc.data().lastname);
        avatar = doc.data().avatar;
        passwordHash = doc.data().hash;
    } 
    else {
      throw { 'status': 401,  'statusTxt': 'Unauthorized user!', 'data': 'Unauthorized request' }; 
    }

    if (bcrypt.compareSync(password, passwordHash)){
      const token = jwt.sign({ id: userId, name: fullname, usr: username, avt: avatar }, jwt_config.secret, { expiresIn: '7d' });
      return res.json({token, msg: "Successfully authenticated"}); 
    } 
    else {
      throw {'status': 401, 'statusTxt': 'Unauthorized user!', 'data': 'Unauthorized request'};
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

const signupHandler = async (req, res, next) => {
  try {
    var email = req.body.email.trim().toLowerCase();
    var username = req.body.username.trim().toLowerCase();
    var password = req.body.password;
    var confirm = req.body.confirm;
    if (username.length <= 3) {
      throw {'status': 400, 'statusTxt': 'Username is less than 4 characters!', 'data': 'Username must be longer than 4 characters!'}; 
    }

    if(!helper.isEmail(email)) {
      throw { 'status': 400, 'statusTxt': 'Email is not valid', 'data': 'Email is not valid!'};
    }

    const userRef = db.collection('users');
    const emailSnap = await userRef.where("email", "==", email).get();
    const usernameSnap = await userRef.where("username", "==", username).get();
    if (helper.isItOnlyOne(emailSnap)) {
      throw {'status': 400, 'statusTxt': 'You already have an account', 'data': 'You already have an account, please login using your email'};
    }
    if (helper.isItOnlyOne(usernameSnap)) {
      throw {'status': 400, 'statusTxt': 'Username is owned', 'data': 'username is taken by someone else, try again with different username'};
    }

    if (password !== confirm) {
      throw {'status': 400, 'statusTxt': "Password and confirm email doesn't match!", 'data': "Password and confirm password doesn't match!"}; 
    }
    
    const saltRounds = 10; 
    let hash = await bcrypt.hash(password, saltRounds); 

    const docRef = await userRef.add({
      username: username,
      email: email,
      password: hash
    });
    
    const token = jwt.sign({ id: docRef.id, name: null, usr: username, avt: null }, jwt_config.secret, { expiresIn: '7d' });
    console.log(token);
    return res.json({token, msg: "Successfully signed up"});
  }
  catch (err) {
    console.log(err);
    let {status, statusTxt, data} = err; 
    if (!status){
      status = 500; 
      statusTxt = err.message; 
      data = err; 
    }
    res.status(status).json(data); 
  }
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
