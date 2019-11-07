const router = require('express').Router();
const db = require('../db');

module.exports = async (req, body) => new Promise((resolve, reject) => {
  Promise.resolve()

  .then(() => new Promise((resolve, reject) => {
    if(!req.isAuthenticated())
    {
      return reject('Unauthenticated');
    }
    return resolve();
  }))

  .then(() => new Promise((resolve, reject) => {

    let username = null;

    if(Object.prototype.hasOwnProperty.call(body, 'username'))
    {
      username = body.username;
    }

    if(username === null || username === undefined)
    {
      return reject('Invalid username');
    }

    if(!/^[a-z0-9]+$/i.test(username))
    {
      return reject('Name must contain only alphanumeric values');
    }

    if(username.length < 8)
    {
      return reject('Username must contain at least 8 characters');
    }

    return resolve(username);
  }))

  .then((username) => new Promise((resolve, reject) => {
    db.query('UPDATE users SET username = ? WHERE _ID = ?', [username, req.user]).then(() => {
      return resolve(username);
    }).catch((err) => {
      return reject(err);
    })
  }))

  .then((username) => {
    return resolve(username);
  })

  .catch((err) => {
    return reject(err);
  })
})
