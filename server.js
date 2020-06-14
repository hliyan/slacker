const express = require('express');
const crypto = require('crypto');
const axios = require('axios');

const app = express();
app.use(express.text({type: "*/*"})); // need raw body to compute hmac

const slackApi = axios.create({
  baseURL: 'https://slack.com/api',
  timeout: 4000,
  headers: {
    'Content-Type': 'application/json', 
    'Authorization': `Bearer ${process.env.SLACK_BOT_TOKEN}`
  }
});

app.get('/', (req, res) => { // basic test endpoint
  res.status(200).json({hello: 'world'});
});

app.post('/slack/event', (req, res) => {
  if (req.headers['x-slack-signature']) { // https://api.slack.com/authentication/verifying-requests-from-slack
    const sha256 = crypto.createHmac('sha256', process.env.SLACK_SIGNING_SECRET || 'secret');
    const signature = sha256.update(`v0:${ req.headers['x-slack-request-timestamp']}:${req.body}`).digest('hex');
    const messageSignature = req.headers['x-slack-signature'].split('=')[1];
    if (signature !== messageSignature) {
      console.log('signature mismatch: ' + signature + ' != ' + messageSignature);
      res.status(401).json({});
      return;
    }
  }

  const json = JSON.parse(req.body);
  if (json.type === 'url_verification') { // initial challenge from slack
    res.status(200).json({challenge: json.challenge});
    return;
  }

  if (json.type === 'event_callback') {
    if (json.event.type === 'message') {
      console.log(`MESSAGE: user=${json.event.user}, channel=${json.event.channel}, text=${json.event.text}`);
      let res = await slackApi.post('chat.postMessage', {
        channel: json.event.channel,
        text: json.event.text
      });
    }
  }
  res.status(200).json({});
});

module.exports = app;