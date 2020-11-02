/* Firestore admin SDK config */
const firebase = require("firebase");
require("firebase/firestore");
const firebaseConfig = {
  apiKey: "AIzaSyCdieC7ProvSDITn-PE7bCiiL75QS7ceZI",
  authDomain: "twitter-app-a08a4.firebaseapp.com",
  databaseURL: "https://twitter-app-a08a4.firebaseio.com",
  projectId: "twitter-app-a08a4",
  storageBucket: "twitter-app-a08a4.appspot.com",
  messagingSenderId: "385100571391",
  appId: "1:385100571391:web:b6d833952f0a34527e22ca"
};
firebase.initializeApp(firebaseConfig);
exports.db = firebase.firestore();

//module.exports = db;

exports.jwt_config ={ "secret": "49a44cbeaa62456326b905c0abab43ec" };
