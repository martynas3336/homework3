const router = require('express').Router();
const passport = require('passport');

router.post('/', (req, res, next) => {

  Promise.resolve()

  .then(() => { return new Promise((resolve, reject) => {
    if(req.isAuthenticated())
    {
      return reject('Already logged in');
    }
    return resolve();
  })})

  .then(() => { return new Promise((resolve, reject) => {

    passport.authenticate('local-signin', function(err, user, info) {
      if (err) {
        if(info && 'message' in info)
				{
          return reject(info.message);
				}
        return reject(err);
      }

      if (!user) {
        if(info && 'message' in info)
				{
          return reject(info.message);
				}
        return reject(err);
      }
      //Authentication successful
      req.logIn(user, function(err) {
        if (err) {
          return reject(err);
        }

        if (req.body.remember) {
          req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 7; // 7 DAYS
        } else {
          req.session.cookie.maxAge = 1000 * 60 * 60 * 3; // 3 HOURS
        }
        return resolve(user);
      });
    })(req, res, next);
  })})

  .then((user) => {
    req.ser.json(user);
    return req.ser.done();
  })

  .catch((err) => {
    req.ser.status(500);
    req.ser.json({error:err});
    return req.ser.done(false);
  })
})

module.exports = router;
