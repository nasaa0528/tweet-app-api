const helper = require('../utils/helpers.js'); 
const config = require('../utils/config.js'); 
const db = config.db; 

const addPostHandler = async (req, res, next) => {
  try {
    const id = req.user.id;
    const fullname = req.user.name;
    const username = req.user.usr;
    const avatar = req.user.avt;
    const post = req.body.post;
    if (post.lengthi === 0) throw {"status": 400, "statusTxt": "Post field cannot be empty", "data": "post field cannot be empty"}; 
    console.log(id, fullname, username, avatar, post); 
    await db.collection('posts').add({
      
    })
    console.log(req.user);
  } catch (err) {
    helper.errorHandler(res, err);
  }
};

module.exports = {
  addPostHandler
}
