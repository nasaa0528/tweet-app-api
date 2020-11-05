const helper = require('../../utils/helpers');
const config = require('../../utils/config');
const db = config.db; 
const firebase = require('firebase');

const followHandler = async (req, res, next) => {
  try {
    const toFollowUserId = req.query.userid;
    const loggedUser = {
      "id": req.user.id,
      "name": req.user.name,
      "username": req.user.usr,
      "avatar": req.user.avt
    };
    if (!toFollowUserId) {
      throw {"status": 400, "statusTxt": "userid cannot be empty", "data": "userid cannot be empty"};
    }
    const userDoc = await db.collection("users").doc(toFollowUserId).get();
    if (!userDoc.exists){
      throw { "status": 400, "statusTxt": "Invalid userid", "data": "invald userid" };
    }
    followingSnap = await db.collection('users').doc(loggedUser.id).collection('following').doc(userDoc.id).get();

    if (followingSnap.exists) {
      throw {"status": 400, "statusTxt": "You are already following this person", "data": "You are already following this person"};
    }

    await db.collection('users').doc(loggedUser.id).collection('following').doc(userDoc.id).set({
      'id': userDoc.id,
      'avatar': userDoc.data().avatar,
      'name': helper.nameConcat(userDoc.data().firstname, userDoc.data().lastname),
      'username': userDoc.data().username
    }, {merge: true});
    await db.collection('users').doc(loggedUser.id).update({
      following: firebase.firestore.FieldValue.increment(1)
    });

    await db.collection('users').doc(toFollowUserId).collection('followers').doc(loggedUser.id).set({
      loggedUser,
    }, {merge: true});
    await db.collection('users').doc(toFollowUserId).update({
      followers: firebase.firestore.FieldValue.increment(1)
    });

    res.json({"msg": "Followed Successfully "});
  } catch (err) {
    helper.errorHandler(res, err);
  }
};

const unfollowHandler = async (req, res, next) => {
  try{
    const loggedUser = {
      "id": req.user.id,
      "name": req.user.name,
      "username": req.user.usr,
      "avatar": req.user.avt
    };
    const toUnfollowUserId = req.query.userid;
    if (!toUnfollowUserId){
      throw {"status": 400, "statusTxt": "userid cannot be empty", "data": "userid cannot be empty"};
    }
    const followingSnap = await db.collection('users').doc(loggedUser.id).collection('following').doc(toUnfollowUserId).get();

    if(!followingSnap.exists) {
      throw {"status": 400, "statusTxt": "You are not following this person", "data": "You are not following this person" };
    }

    await db.collection('users').doc(loggedUser.id).collection('following').doc(toUnfollowUserId).delete();
    await db.collection('users').doc(loggedUser.id).update({
      following: firebase.firestore.FieldValue.increment(-1)
    });
    await db.collection('users').doc(toUnfollowUserId).collection('followers').doc(loggedUser.id).delete();
    await db.collection('users').doc(toUnfollowUserId).update({
      followers: firebase.firestore.FieldValue.increment(-1)
    });
    res.json({ "msg": "Unfollowed successfully!"});
  } catch (err){
    helper.errorHandler(res, err);
  }
};

const followersHandler = async (req, res, next) => {
  try {
    const user = {
      "id": req.user.id,
      "name": req.user.name,
      "username": req.user.usr,
      "avatar": req.user.avt
    };
    const defaultPagesize = 20;
    const defaultPage = 1;
    const page = req.query.page || defaultPage;
    const pageSize = req.query.pagesize || defaultPagesize;
    if (page <= 0 || pageSize <= 0) {
      throw { "status": 400, "statusTxt": "Page size and page cannot be negative", "data": "Page size or page cannot be negative" };
    }
    const startAt = (page - 1) * pageSize;
    const endAt = page * pageSize;

    var followersSnap = await db.collection('users').doc(user.id).collection('followers').get();
    var meta = {'total': followersSnap.size, 'requested_page': page};
    followersSnap = followersSnap.docs.slice(startAt, endAt);
    var followers = []
    followersSnap.forEach((doc) => {
      let follower = {'followerId': doc.id, ...doc.data()};
      followers.push(follower);
    });
    var result = {
      "meta": meta,
      "followers": followers
    };
    return res.json(result);

  } catch (err) {
    helper.errorHandler(res, err);
  }
};

const followingHandler = async (req, res, next) => {
  try {
    const user = {
      "id": req.user.id,
      "name": req.user.name,
      "username": req.user.usr,
      "avatar": req.user.avt
    };
    const defaultPagesize = 20;
    const defaultPage = 1;
    const page = req.query.page || defaultPage;
    const pageSize = req.query.pagesize || defaultPagesize;
    if (page <= 0 || pageSize <= 0) {
      throw { "status": 400, "statusTxt": "Page size and page cannot be negative", "data": "Page size or page cannot be negative" };
    }
    const startAt = (page - 1) * pageSize;
    const endAt = page * pageSize;

    var followingSnap = await db.collection('users').doc(user.id).collection('following').get();
    var meta = {'total': followingSnap.size, 'requested_page': page};
    followingSnap = followingSnap.docs.slice(startAt, endAt);
    var followings = [];
    followingSnap.forEach((doc) => {
      let following = {'followerId': doc.id, ...doc.data()};
      followings.push(following);
    });
    var result = {
      "meta": meta,
      "followings": followings
    };
    return res.json(result);

  } catch (err) {
    helper.errorHandler(res, err);
  }
};

module.exports = {
  followHandler,
  unfollowHandler,
  followersHandler,
  followingHandler
}
