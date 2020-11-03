const helper = require('../utils/helpers.js'); 
const config = require('../utils/config.js'); 
const db = config.db;

const getAllUsersHandler = async (req, res, next) => {
  try {
    const defaultPage = 1;
    const defalutPagesize = 20;
    var page = req.query.page || defaultPage;
    var pageSize = req.query.pagesize || defalutPagesize;
    var result = [];
    var startAt = (page-1) * pageSize;
    var endAt = page * pageSize;

    if (page <= 0 || pageSize <= 0)
      throw {"status": 400, "statusTxt": "page number or page size must be positive", "data": "page number must be positive"};
    const snap = await db.collection('users').orderBy('created').get();
    const snapsize = snap.size;
    const meta = {
      'Total users': snapsize,
      'Requested page': page
    };
    result.push(meta);

    if (startAt >= 0 && startAt <= snapsize && endAt > startAt && endAt >= 0 && endAt < snapsize) {
      page = snap.docs.slice(startAt, endAt); 
    }
    else if (startAt >=0 && startAt <= snapsize && endAt > snapsize) {
      page = snap.docs.slice(startAt); 
    }
    meta['Total returned users'] = page.length; 
    page.forEach((doc) => {
      let user = {
        id: doc.id,
        avatar: doc.data().avatar,
        fullname: helper.nameConcat(doc.data().firstname, doc.data().lastname),
        username: doc.data().username,
        followers: doc.data().followers,
        following: doc.data().following
      }
      result.push(user);
    })
    res.json(result);
  } catch (err) {
    console.log(err);
    let { status, statusTxt, data } = err;
    if (!status) {
      status = 500;
      statusTxt = err.statusTxt;
      data = err;
    }
    res.status(status).json(data);
  }
};

module.exports = {
  getAllUsersHandler,
}
