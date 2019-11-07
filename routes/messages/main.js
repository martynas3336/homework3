const router = require('express').Router();
const db = require('../../db');

router.get('/', (req, res, next) => {
  Promise.resolve()

  .then(() => new Promise((resolve, reject) => {
    if(!req.isAuthenticated())
    {
      return reject('Unauthenticated');
    }
    return resolve();
  }))

  .then(() => new Promise((resolve, reject) => {
    let id = null;
    if(Object.prototype.hasOwnProperty.call(req.query, 'id'))
    {
      id = req.query.id;
    }

    if(id)
    {
      db.query('SELECT * FROM messages WHERE (messagedBy = ? AND messagedTo = ?) OR (messagedBy = ? AND messagedTo = ?)', [req.user, id, id, req.user]).then((res) => {
        return resolve(res);
      }).catch((err) => {
        return reject(err);
      })
    } else {
      db.query('SELECT * FROM messages WHERE messagedBy = ? OR messagedTo = ?', [req.user, req.user]).then((res) => {
        return resolve(res);
      }).catch((err) => {
        return reject(err);
      })
    }
  }))

  .then((res) => {
    req.ser.json(res);
    req.ser.done();
  })

  .catch((err) => {
    console.log(err);
    req.ser.status(500);
    req.ser.json({error:err});
    req.ser.done();
  })

})

module.exports = router;
