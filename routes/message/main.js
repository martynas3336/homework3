const router = require('express').Router();
const messageAction = require('../../actions/message');

router.post('/', (req, res, next) => {
  Promise.resolve()

  .then(() => new Promise((resolve, reject) => {
    return resolve(messageAction(req, req.body));
  }))

  .then((res) => {
    req.ser.json(res);
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
      return resolve(messageAction(req, message));
    }))

    // you can expand your logic here

    .then((message) => {
      ws.send(JSON.stringify({success:{message}}));
    })

    .catch((err) => {
      ws.send(JSON.stringify({error:err}));
    })

  })
})

module.exports = router;
