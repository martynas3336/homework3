const router = require('express').Router();
const db = require('../../db');

router.get('/', (req, res, next) => {
  db.query('SELECT _ID, username, avatar FROM users').then((res) => {
    req.ser.json(res);
    req.ser.done();
  }).catch((err) => {
    req.ser.json({error:err});
    req.ser.done();
  })
})

module.exports = router;
