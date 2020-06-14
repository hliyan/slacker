const axios = require('axios');

const slackApi = axios.create({
  baseURL: 'https://slack.com/api',
  timeout: 4000,
  headers: {
    'Content-Type': 'application/json', 
    'Authorization': `Bearer ${process.env.SLACK_BOT_TOKEN}`
  }
});

module.exports = slackApi;