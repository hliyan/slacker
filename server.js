const express = require('express');

const app = express();
app.use(express.json());

app.get('/', (req, res) => { // basic test endpoint
  res.status(200).json({hello: 'world'});
});

app.post('/slack/event', (req, res) => {
  if (req.body.type === 'url_verification') { // challenge from slack
    res.status(200).json({challenge: req.body.challenge});
    return;
  }

  res.status(200).json({});
});

module.exports = app;