const router = require('express').Router();
const usernameAction = require('../../actions/username');

router.post('/', (req, res, next) => {
  Promise.resolve()

  .then(() => new Promise((resolve, reject) => {
    return resolve(usernameAction(req, req.body));
  }))

  .then((username) => {
    req.ser.json({username});
    req.ser.done();
  })

  .catch((err) => {
    req.ser.status(500);
    req.ser.json({error:err});
    req.ser.done();
  })
})

router.ws('/', (ws, req) => {
  ws.on('message', (msg) => {
    try {
      message = JSON.parse(msg);
    } catch (err) {
      ws.send(JSON.stringify({error:'Invalid data'}))
      return;
    }

    Promise.resolve()

    .then(() => new Promise((resolve, reject) => {
      return resolve(usernameAction(req, message));
    }))

    // you can expand your logic here

    .then((username) => {
      ws.send(JSON.stringify({success:{username}}));
    })

    .catch((err) => {
      ws.send(JSON.stringify({error:err}));
    })

  })

})

module.exports = router;
