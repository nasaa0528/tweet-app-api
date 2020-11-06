/* Firestore admin SDK config */
const firebase = require("firebase-admin");
require("firebase/firestore");
var serviceAccount = require("../twitter-app-a08a4-firebase-adminsdk-ftwdd-37edc472fc.json");
const firebaseConfig = {
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://twitter-app-a08a4.firebaseio.com"
};
firebase.initializeApp(firebaseConfig);
exports.db = firebase.firestore();
exports.timestamp = firebase.firestore.FieldValue.serverTimestamp();
exports.jwt_config ={ "secret": "49a44cbeaa62456326b905c0abab43ec" };
