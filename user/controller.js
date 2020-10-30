const jwt = require("jsonwebtoken"); 
const jwt_config ={ "secret": "49a44cbeaa62456326b905c0abab43ec" };
const helper = require('../utils/helpers'); 



const dbConfig = require("../utils/config.js"); 
const db = dbConfig.db; 

const loginHandler = async (req, res, next) => {
  const usernameEmail = req.body.usernameEmail; 
  const password = req.body.password; 
  console.log(usernameEmail, password); 
  const isEmail = helper.isEmail(usernameEmail); 
  console.log(isEmail); 
  //var user; 
  //var response; 
  //if (!loginName || !password){
    //response = { 'msg': "Login name/email or Password field cannot be empty!" }; 
    //throw "Username or password must be provided!"; 
    //res.json(response); 
  //}
  //else {
  //const userRef = db.collection("users"); 

  //[> DB read and authenticate user <]
  //async function authenticate(userRef, username) {
    //const isUsername = userRef.where('username', '==', username).get(); 
    //const isEmail = userRef.where('email', '==', username).get(); 

    //const [usernameSnap, emailSnap] = await Promise.all([
      //isUsername, 
      //isEmail
    //]);

    //const usernameArray = usernameSnap.docs; 
    //const emailArray = emailSnap.docs; 

    //const userArray = usernameArray.concat(emailArray); 
    
    //return userArray; 
  //}

  //authenticate(userRef, loginName).then(result => {
    //if(result.length !== 1){
      //console.log(`${loginName} is not found!`); 
      //response = {'msg': loginName + " is not found "}; 
    //} else {
      //result.forEach(doc => {
        //if (doc.data().username === loginName || doc.data().email === loginName ){
          //let hash = doc.data().hash; 
          //if (hash === password) {
            //console.log(`Create jwt token for user ${loginName}`); 
            //response = {"msg": "token is created successfully!"}; 
            //// response = token; 
          //}
          //else {
            //throw {status: 401, statusTxt: "Unauth", data: {}};
            //response = {'msg': "Incorrect password"};
          //}
        //}
      //}); 
    //}
    //res.json(response);
  //})
  // }

  /*
   *try{}
   *catch(e) {
   *  let {status, statusTxt, data} = e;
   *  if(!status) {
   *    status = 500;
   *    statusTxt = e.message;
   *    data = e;
   *  }
   *  res.status(status).json(data);
   *}
   */
    res.json(req.body); 
};

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
