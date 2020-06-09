const express = require('express');
const crypto = require('crypto');

const app = express();
app.use(express.text());

app.get('/', (req, res) => { // basic test endpoint
  res.status(200).json({hello: 'world'});
});

app.post('/slack/event', (req, res) => {
  // https://api.slack.com/authentication/verifying-requests-from-slack
  const sha256 = crypto.createHmac('sha256', process.env.SLACK_SIGNING_SECRET);
  const signature = sha256.update(`v0:${ req.headers['x-slack-request-timestamp']}:${req.body}`).digest('hex');
  const messageSignature = req.headers['x-slack-signature'].split('=')[2];
  console.log(req.body);
  console.log(messageSignature);
  console.log(signature);

  //if (req.headers['x-slack-signature'] !== signature) {
  //  console.log('signature mismatch: ' + req.headers['x-slack-signature'] + ' != ' + signature);
    //res.status(401).json({});
    //return;    
  //}

  if (req.body.type === 'url_verification') { // challenge from slack
    res.status(200).json({challenge: req.body.challenge});
    return;
  }

  res.status(200).json({});
});

module.exports = app;