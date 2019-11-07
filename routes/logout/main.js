const router = require('express').Router();

router.get('/', (req, res, next) => {
  if(!req.isAuthenticated())
  {
    req.ser.status(500);
    req.ser.json({error:'Unauthenticated'});
    return req.ser.done();
  }
  req.logout();
  req.ser.json({});
  return req.ser.done();
})


module.exports = router;
