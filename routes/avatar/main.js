const router = require('express').Router();
const path = require('path');
const uniqid = require('uniqid');
const db = require('../../db');
const fs = require('fs');

router.post("/", (req, res, next) => {
  Promise.resolve()

  .then(() => new Promise((resolve, reject) => {
    if(!req.isAuthenticated())
    {
      return reject('Unauthenticated');
    }
    return resolve();
  }))

  .then(() => new Promise((resolve, reject) => {
    if(!(req.files && req.files.avatar)) return reject('Please upload a file');

    return resolve();
  }))

  .then(() => new Promise((resolve, reject) => {

    let name = req.files.avatar.name.split('.');
    let ext = name.pop();
    name = name.join('');

    if(!['png', 'jpg'].includes(ext))
    {
      return reject('only .png and .jpg files are available');
    }
    let newName = `${name}${Date.now()}.${ext}`;
    let targetPath = path.join(__dirname, `../../public/avatars/${newName}`);
    let publicPath = `/public/avatars/${newName}`;
    req.files.avatar.mv(targetPath, (err) => {
      if(err)
      {
        return reject(err);
      }
      return resolve(publicPath);
    })
  }))

  .then((publicPath) => new Promise((resolve, reject) => {
    db.query('UPDATE users SET avatar = ? WHERE _ID = ?', [publicPath, req.user]).then(() => {
      return resolve(publicPath);
    }).catch((err) => {
     return reject(err);
    })
  }))

  .then((publicPath) => {
    req.ser.json({pathName});
    req.ser.done();
  })

  .catch((err) => {
    req.ser.status(500);
    req.ser.json({error:err});
    req.ser.done();
  })
});

module.exports = router;
