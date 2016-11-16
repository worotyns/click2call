const express = require('express')
const path = require('path')
const app = express();
const config = require('../../config.json');
const telecube = require('../../src/server')(config);
const bodyParser = require('body-parser');
/**
 * BodyParser
 */

app.use(bodyParser.json());
/**
 * Dummy
 */
app.post('/dummy', function (req, res) {
  setTimeout(() => res.send({error: "OK"}), 3000)
})

/**
 * Proxy call to telecube
 */
app.post('/call', function (req, res, next) {
  const body = req.body || {};
  const phone = body.phone || null;

  if(!phone) res.status(400).send('No phone');

  const onResolve = (body) => {
    res.send(body);
  }

  const onReject = (body) => {
    res.status(500).send(body);
  }

  telecube
    .call(phone)
    .then(onResolve, onReject);
})

/**
 * Serve client files
 */
app.use('/', express.static(path.join(__dirname, '..', 'client')));

app.listen(3000, function () {
  console.log('Telecube proxy example app listening on port 3000!')
})