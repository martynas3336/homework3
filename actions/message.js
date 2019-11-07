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

    let id = null;
    let message = null;
    if(Object.prototype.hasOwnProperty.call(body, 'id'))
    {
      id = body.id;
    }

    if(Object.prototype.hasOwnProperty.call(body, 'message'))
    {
      message = body.message;
    }

    if(id === null || id === undefined)
    {
      return reject('Invalid recipient id');
    }

    if(message === null || message === undefined)
    {
      return reject('Invalid message');
    }

    if(id === req.user)
    {
      return reject('Can not send message to self.');
    }

    if(message.length > 5000)
    {
      return reject('Message too long. Max 5000');
    }

    return resolve({id, message});
  }))

  // validate recipient id
  .then(({id, message}) => new Promise((resolve, reject) => {
    db.query('SELECT * FROM users WHERE _ID = ?', [id]).then((rows) => {
      if(!rows.length)
      {
        return reject('Invalid recipient id');
      }
      return resolve({id, message});
    }).catch((err) => {
      return reject(err);
    })
  }))

  .then(({id, message}) => new Promise((resolve, reject) => {
    db.query('INSERT INTO messages (messagedBy, messagedTo, message) VALUES (?, ?, ?)', [req.user, id, message]).then(() => {
      return resolve({id, message});
    }).catch((err) => {
      return reject(err);
    })
  }))

  .then(({id, message}) => {
    return resolve({messageFrom:req.user, messageTo:id, message});
  })

  .catch((err) => {
    return reject(err);
  })
})
