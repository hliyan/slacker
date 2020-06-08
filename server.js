const express = require('express');

const app = express();
app.use(express.json());

app.get('/', (req, res) => { // basic test endpoint
  res.status(200).json({hello: 'world'});
});

app.post('/slack/event', (req, res) => {
  // TODO: https://api.slack.com/authentication/verifying-requests-from-slack
  /*
  if (!slack.isValidSignature(req.headers[x-slack-signature], 
    req.headers['x-slack-request-timestamp'], req.body)) {
      res.status(401).json({});
      return;
  }
  */


  if (req.body.type === 'url_verification') { // challenge from slack
    res.status(200).json({challenge: req.body.challenge});
    return;
  }

  res.status(200).json({});
});

module.exports = app;