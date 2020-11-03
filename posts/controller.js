const helper = require('../utils/helpers.js'); 
const config = require('../utils/config.js'); 
const db = config.db; 

const addPostHandler = async (req, res, next) => {
  try {
    const user = {
      "id": req.user.id, 
      "fullname": req.user.name, 
      "username": req.user.usr, 
      "avatar": req.user.avt
    }
    const post = req.body.post;
    if (post.lengthi === 0) throw {"status": 400, "statusTxt": "Post field cannot be empty", "data": "post field cannot be empty"}; 
    const postRef = await db.collection('posts').add({
      user: user,
      post: post,
      created: config.timestamp
    });
    res.json({ "msg": "Post is added successfully with: " + postRef.id });
  } catch (err) {
    helper.errorHandler(res, err);
  }
};

const postsHandler = async (req, res, next) => {
  /*TODO*/
  // pagination
  // select query fix
  try {
    const userId = req.query.userId;
    const userPosts = await db.collection('posts').where('user.id', '==', userId).get();
    const posts = []; 
    userPosts.forEach((doc) => {
      let post = {"postId": doc.id, ...doc.data()};
      posts.push(post); 
    });
    result = {}; 
    result['total'] = userPosts.size;
    result['posts'] = posts;
    return res.json(result);
  } catch (err){
    helper.errorHandler(res, err);
  }
};

module.exports = {
  addPostHandler,
  postsHandler
}
