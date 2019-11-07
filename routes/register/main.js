const router = require('express').Router();
const passport = require('passport');


router.post('/', (req, res, next) => {

  Promise.resolve()

  .then(() => new Promise((resolve, reject) => {
    if(req.isAuthenticated())
    {
      return reject('Already logged in');
    }
    return resolve();
  }))

  .then(() => new Promise((resolve, reject) => {

    passport.authenticate('local-signup', function(err, user, info) {
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
      return resolve(user);
    })(req, res, next);
  }))

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
