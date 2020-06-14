const express = require('express');
const crypto = require('crypto');
const slackApi = require('./slackApi');

const app = express();
app.use(express.text({type: "*/*"})); // need raw body to compute hmac

app.get('/', (req, res) => { // basic test endpoint
  res.status(200).json({hello: 'world'});
});

app.post('/slack/event', async (req, res) => {
  if (req.headers['x-slack-signature']) { // https://api.slack.com/authentication/verifying-requests-from-slack
    const sha256 = crypto.createHmac('sha256', process.env.SLACK_SIGNING_SECRET || 'secret');
    const signature = sha256.update(`v0:${ req.headers['x-slack-request-timestamp']}:${req.body}`).digest('hex');
    const messageSignature = req.headers['x-slack-signature'].split('=')[1];
    if (signature !== messageSignature) {
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
    /* istanbul ignore next */ // tested using the conversation engine
    if ((json.event.type === 'message') && (json.event.subtype !== 'bot_message')) {
      try {
        let res = await slackApi.post('chat.postMessage', {
          channel: json.event.channel,
          text: json.event.text
        });
        
        if (!res.data.ok) { // {data: {ok:bool, error:str} }
          console.error(res.data);
        }
      } catch (e) {
        console.log(e);
      }

    }
  }
  res.status(200).json({}); // TODO: don't keep slack waiting
  
});

module.exports = app;