const router = require('express').Router();
const user_validator = require('../user_validator');

router.use((req, res, next) => {
  next();
})

router.use((req, res, next) => {
  user_validator(req).then(() => {
    next();
  }).catch((err) => {
    req.ser.status(500);
    req.ser.json({error:err});
  })
})

router.get('/', (req, res, next) => {
  req.ser.render('./views/index.ejs');
  req.ser.done();
})

router.use('/login', require('./login'));
router.use('/logout', require('./logout'));
router.use('/register', require('./register'));
router.use('/users', require('./users'));
router.use('/message', require('./message'));
router.use('/messages', require('./messages'));
router.use('/avatar', require('./avatar'));
router.use('/username', require('./username'));

router.use((req, res, next) => {
  req.ser.json({});
  req.ser.done();
})

router.use((err, req, res, next) => {
  req.ser.status(500);
  req.ser.json({error:err});
  req.ser.done();
})
module.exports = router;
