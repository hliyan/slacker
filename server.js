const express = require('express');
const crypto = require('crypto');
const slackApi = require('./slackApi');

const app = express();
app.use(express.text({type: "*/*"})); // need raw body to compute hmac

app.get('/', (req, res) => { // basic test endpoint
  res.status(200).json({hello: 'world!'});
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

  const body = JSON.parse(req.body);
  if (body.type === 'url_verification') { // initial challenge from slack
    res.status(200).json({challenge: body.challenge});
    return;
  }

  if (body.type === 'event_callback') {
    /* istanbul ignore next */ // tested using the conversation engine
    if ((body.event.type === 'message') && (body.event.user !== "U013S66EMK9")) { // messages from other users
      try {
        let res = await slackApi.post('chat.postMessage', {
          channel: body.event.channel,
          text: 'hello'
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
