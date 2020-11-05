const helper = require('../utils/helpers.js'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 
const config = require('../utils/config.js'); 
const jwt_config = config.jwt_config; 
const db = config.db;
const firebase = require("firebase");

const getAllUsersHandler = async (req, res, next) => {
  try {
    const defaultPage = 1;
    const defalutPagesize = 20;
    var page = req.query.page || defaultPage;
    var pageSize = req.query.pagesize || defalutPagesize;
    var users = [];
    var startAt = (page-1) * pageSize;
    var endAt = page * pageSize;
    var result = {}; 

    if (page <= 0 || pageSize <= 0)
      throw {"status": 400, "statusTxt": "page number or page size must be positive", "data": "page number must be positive"};
    const snap = await db.collection('users').orderBy('created').get();
    const snapsize = snap.size;
    const meta = {
      'total': snapsize,
      'requestedPage': page
    };
    page = snap.docs.slice(startAt, endAt); 
    meta['usersInPage'] = page.length; 
    page.forEach((doc) => {
      let user = {
        id: doc.id,
        avatar: doc.data().avatar,
        fullname: helper.nameConcat(doc.data().firstname, doc.data().lastname),
        username: doc.data().username,
        followers: doc.data().followers,
        following: doc.data().following
      }
      users.push(user);
    })
    result['meta'] = meta; 
    result['users'] = users;
    res.json(result);
  } catch (err) {
    helper.errorHandler(res, err);
  }
};

const loginHandler = async (req, res, next) => {
  try {
    const usernameEmail = req.body.usernameEmail.trim().toLowerCase();
    const password = req.body.password;

    if (!helper.usernameParser(usernameEmail)) {
      throw {'status': 400, 'statusTxt': 'Empty username' , "data": "Login name/email field cannot be empty!" };
    }
    if (!helper.passwordParser(password)) {
      throw {'status': 400, 'statusTxt': 'Empty password', "data": "Password field cannot be empty!" };
    }

    const isEmail = helper.isEmail(usernameEmail);
    const userRef = db.collection("users");
    var snapshot;

    if (isEmail) {
      snapshot = await userRef.where('email', '==', usernameEmail).get();
    } else {
      snapshot = await userRef.where('username', '==', usernameEmail).get();
    }
    if (helper.isItOnlyOne(snapshot)){
      const doc = snapshot.docs[0];
      var userId = doc.id;
      var username = doc.data().username;
      var fullname = helper.nameConcat(doc.data().firstname, doc.data().lastname);
      var avatar = doc.data().avatar;
      var passwordHash = doc.data().hash;
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
    helper.errorHandler(res, err);
  };
}

const signupHandler = async (req, res, next) => {
  try {
    var email = req.body.email.trim().toLowerCase();
    var username = req.body.username.trim().toLowerCase();
    var password = req.body.password;
    var confirm = req.body.confirm;
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var avatar = req.body.avatar || 'default_path_placeholder';
    if (username.length <= 3) {
      throw {'status': 400, 'statusTxt': 'Username is less than 4 characters!', 'data': 'Username must be longer than 4 characters!'};
    }

    if(!helper.isEmail(email)) {
      throw { 'status': 400, 'statusTxt': 'Email is not valid', 'data': 'Email is not valid!' };
    }
    if(firstname.length === 0) {
      throw {'status': 400, 'statusTxt': 'Firstname empty', 'data': 'Firstname cannot be empty'};
    }

    if(lastname.length === 0) {
      throw {'status': 400, 'statusTxt': 'Lastname empty', 'data': 'Lastname cannot be empty'};
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
      firstname: firstname, 
      lastname: lastname,
      username: username,
      email: email,
      hash: hash,
      followers: 0,
      following: 0,
      avatar: avatar,
      created: config.timestamp
    });

    const token = jwt.sign({ id: docRef.id, name: helper.nameConcat(firstname, lastname), usr: username, avt: avatar }, jwt_config.secret, { expiresIn: '7d' });
    return res.json({token, msg: "Successfully signed up"});
  }
  catch (err) {
    helper.errorHandler(res, err);
  }
};

const updateHandler = async (req, res, next) => {
  try {
    var avatar = req.body.avatar;
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var bio = req.body.bio;
    var user = req.user; 
    var userId = user.id;
    if (!avatar) {
      throw {"status": 400, "statusTxt": "avatar cannot be empty", "data": "Avatar cannot be empty, please upload the avatar"};
    }
    if (!firstname) {
      throw {"status": 400, "statusTxt": "firstname cannot be empty", "data": "firstname cannot be empty!"};
    }
    if (!lastname) {
      throw {"status": 400, "statusTxt": "lastname cannot be empty", "data": "lastname cannot be empty"};
    }
    if(!bio) {
      throw {"status": 400, "statusTxt": "Bio cannot be empty", "data": "bio cannot be empty"};
    }
    await db.collection("users").doc(userId).update({
      "avatar": avatar,
      "firstname": firstname,
      "lastname": lastname,
      "bio": bio
    })

    var postsSnap = await db.collection("posts").where('user.id', '==', userId).get(); 
    let batch = db.batch();
    postsSnap.forEach((doc) => {
      const docRef = db.collection('posts').doc(doc.id);
      batch.update(docRef, {
        "user.fullname": helper.nameConcat(firstname, lastname),
        "user.avatar": avatar
      })
    });
    await batch.commit();
    res.json({ "msg": "Successfully updated!" });
  }
  catch (err) {
    helper.errorHandler(res, err);
  }
};

const getUserHandler = async (req, res, next) => {
  try {
    const requestedId = req.params.id;
    doc = await db.collection('users').doc(requestedId).get();
    if ( !doc.exists ) {
      throw {'status': 404, 'statusTxt': 'invalid user', 'data': 'invalid user ID '};
    }
    var result = {
      'id': doc.id,
      'username': doc.data().username,
      'fullname': helper.nameConcat(doc.data().firstname, doc.data().lastname),
      'bio': doc.data().bio,
      'followers': doc.data().followers,
      'following': doc.data().following
    }
    res.json(result);
  } catch (err) {
    helper.errorHandler(res, err);
  }
};

const getProfileHandler = async (req, res, next) => {
  try {
    const userId = req.user.id;
    user = await db.collection("users").doc(userId).get();
    if (!user.exists){
      throw {"status": 400, "statusTxt": "User not found, malicous token", "data": "User not found!"};
    }
    var result = {'id': user.id, ...user.data()};
    res.send(result);
  } catch (err) {
    helper.errorHandler(res, err);
  }
}

module.exports = {
  loginHandler,
  signupHandler,
  updateHandler,
  getProfileHandler,
  getAllUsersHandler,
  getUserHandler
}
