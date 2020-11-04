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
  try {
    const userId = req.query.userid;
    const defaultPagesize = 5;
    const defaultPage = 1;
    const page = req.query.page || defaultPage;
    const pageSize = req.query.pagesize || defaultPagesize;
    if (!userId) {
      var homeFlag = true; 
    }
    if (page <= 0 || pageSize <= 0) {
      throw { "status": 400, "statusTxt": "Page size and page cannot be negative", "data": "Page size or page cannot be negative" };
    }
    const startAt = (page - 1) * pageSize;
    const endAt = page * pageSize;
    if (homeFlag){
      var allPosts = await db.collection('posts').orderBy('created', 'desc').get();
      var meta = {'total': allPosts.size, 'requested_page': page};
      allPosts = allPosts.docs.slice(startAt, endAt); 
      var posts = []
      allPosts.forEach((doc) =>{
        let post = {'postId': doc.id, ...doc.data()};
        posts.push(post);
      });
      var result = {
        "meta": meta, 
        "posts": posts
      };
    }
    else {
      var userPosts = await db.collection('posts').where('user.id', '==', userId).orderBy('created', 'desc').get();
      let meta = { 'total': userPosts.size, 'requested_page': page };
      userPosts = userPosts.docs.slice(startAt, endAt);
      var posts = [];
      userPosts.forEach((doc) => {
        let post = { "postId": doc.id, ...doc.data() };
        posts.push(post);
      });
      var result = {
        'meta': meta,
        'posts': posts
      };
        result['posts'] = posts;
    }
    return res.json(result);
  } catch (err){
    helper.errorHandler(res, err);
  }
};

const myPostsHandler = async (req, res, next) => {  
  try {
    var user = req.user;
    const userId = user.id;
    const username = user.usr;
    const avatar = user.avt;
    const fullname = user.name;
    const defaultPage = 1;
    const defalutPagesize = 5;
    const page = req.query.page || defaultPage;
    const pageSize = req.query.pagesize || defalutPagesize;
    if (page < 0 || pageSize < 0){
      throw { "status": 400, "statusTxt": "Page size and page cannot be negative", "data": "Page size or page cannot be negative" };
    }
    const startAt = (page - 1) * pageSize;
    const endAt = page * pageSize;
    var myPosts = await db.collection('posts').where('user.id', '==', userId).orderBy('created', 'desc').get();
    let meta = { 'total': myPosts.size, 'requested_page': page };
    myPosts = myPosts.docs.slice(startAt, endAt); 
    var posts = []; 
    myPosts.forEach((doc) => {
      let post = {"postId": doc.id, ...doc.data()}
      posts.push(post); 
    })
    var result = {
      'meta': meta, 
      'posts': posts
    }
    res.json(result);

  } catch (err) {
    helper.errorHandler(res, err);
  }
};

module.exports = {
  addPostHandler,
  postsHandler,
  myPostsHandler 
}
