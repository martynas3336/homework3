const db = require('./db');

module.exports = async function(req={}) { return new Promise((resolve, reject) => {
  req.ser.params('loggedIn', false);

  if (req.isAuthenticated()) {

    req.ser.params('loggedIn', true);

    Promise.resolve()

    .then(() => { return new Promise((resolve, reject) => {
      db.query('SELECT * FROM users WHERE _ID = ?', [req.user]).then((rows) => {
        return resolve(rows[0]);
      }).catch((err) => {
        return reject(err);
      })
    })})

    .then((user) => { return new Promise((resolve, reject) => {
      delete user.password;
      req.ser.userInfo = user;
      return resolve();
    })})

    .then(() => {
      return resolve();
    })

    .catch((err) => {
      return reject(err);
    })
  } else {
    return resolve();
  }
})}
