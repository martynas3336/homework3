const LocalStrategy = require("passport-local").Strategy;
const uniqid = require('uniqid');
const db = require('../db');
const bcrypt = require('bcrypt');

const invalid = function(input) {
  if(input === null || input === undefined || input === '')
  {
    return true;
  }
  return false;
}

module.exports = function(passport) {

  passport.serializeUser(function(_ID, callback) {
    return callback(null, _ID);
  });

  passport.deserializeUser(function(_ID, callback) {
    db.query('SELECT * FROM users WHERE _ID = ?', [_ID]).then((rows) => {
      if (rows.length) {
        return callback(null, rows[0]._ID);
      } else {
        return callback(null, false);
      }
    }).catch(function(err) {
      console.log(err);
      return callback(null, false);
    })
  });

  passport.use(
    "local-signup",
    new LocalStrategy({
      usernameField : "username",
      passwordField : "password",
      passReqToCallback : true
    },

    function(req, username, password, callback) {

      if(invalid(username) || invalid(password))
      {
        return callback('Missing credentials', false, null);
      }

      if(!/^[a-z0-9]+$/i.test(username))
      {
        return callback('Name must contain only alphanumeric values', false, null);
      }

      if(username.length < 8)
      {
        return callback('Username must contain at least 8 characters', false, null);
      }

      if(password.length < 8)
      {
        return callback('Password must contain at least 8 characters', false, null);
      }

      let _ID = uniqid();
      let hashedPassword = bcrypt.hashSync(password, '$2b$10$cKG.wf1rAo3qVV3o6uBkSO');

      db.query('SELECT * FROM users WHERE username = ?', [username]).then((rows) => {
        if(rows.length)
        {
          return callback('Name is already taken.', false, null);
        }

        db.query('INSERT INTO users (_ID, username, password) VALUES (?, ?, ?)', [_ID, username, hashedPassword]).then(() => {
          return callback(null, {username});
        }).catch((err) => {
          return callback('Something went wrong.', false, null);
        })
      }).catch((err) => {
        return callback('Something went wrong.', false, null);
      })
    })
  );

  passport.use(
    "local-signin",
    new LocalStrategy({
      usernameField : "username",
      passwordField : "password",
      passReqToCallback : true
    },
    function(req, username, password, callback) {

      if(invalid(username) || invalid(password))
      {
        return callback('Missing credentials', false, null);
      }

      db.query('SELECT * FROM users WHERE username = ?', [username]).then((rows) => {
        if(!rows.length)
        {
          return callback('User not found.', false, null);
        }

        if(!bcrypt.compareSync(password, rows[0].password))
        {
          return callback('Invalid password.', false, null);
        }

        return callback(null, rows[0]._ID);

      }).catch((err) => {
        return callback('Something went wrong.', false, null);
      })
    })
  );
};
