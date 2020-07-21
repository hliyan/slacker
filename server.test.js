const app = require('./server');
const request = require('supertest');
const crypto = require('crypto'); // for the hmac tests
const sinon = require("sinon"); // to mock the slackApi
const slackApi = require('./slackApi');

// util functions...
const computeHmac = (timestamp, body) => {
  const sha256 = crypto.createHmac('sha256', process.env.SLACK_SIGNING_SECRET || 'secret');
  const signature = sha256.update(`v0:${timestamp}:${body}`).digest('hex');
  return signature;
};

describe('GET /', () => {
  test('should return hello world', (done) => {
    request(app)
      .get('/')
      .expect('Content-Type', /json/)
      .expect(200, { hello: 'world!!' }, done)
  });
});

describe('POST /slack/event', () => {
  test('should respond to the initial challenge sent by slack', (done) => {
    request(app)
      .post('/slack/event')
      .send({ type: 'url_verification', challenge: '12345000' })
      .set('Content-type', 'application/json')
      .expect(200, { challenge: '12345000' }, done);
  });

  test('should respond with 200 for unknown requests', (done) => {
    request(app)
      .post('/slack/event')
      .send({})
      .set('Content-type', 'application/json')
      .expect(200, {}, done);
  });

  test('should respond with 200 when an hmac is correct', (done) => {
    const body = '{"hello":"world"}';
    const timestamp = 123456789;
    const signature = computeHmac(timestamp, body);

    request(app)
      .post('/slack/event')
      .set('Content-type', 'application/json')
      .set('x-slack-request-timestamp', 123456789)
      .set('x-slack-signature', `v0=${signature}`)
      .send(body)
      .expect(200, {}, done);
  });

  test('should respond with 401 when an hmac is incorrect', (done) => {
    const body = '{"hello":"world"}';
    const timestamp = 123456789;
    const signature = 'incorrect-signature';

    request(app)
      .post('/slack/event')
      .set('Content-type', 'application/json')
      .set('x-slack-request-timestamp', timestamp)
      .set('x-slack-signature', `v0=${signature}`)
      .send(body)
      .expect(401, {}, done);
  });

  test('should respond with hello to a message from a user', (done) => {
    const body = JSON.stringify({
      type: 'event_callback',
      event: {
        type: 'message',
        text: 'hello',
        channel: '1234'
      }
    });
    const timestamp = 123456789;
    const signature = computeHmac(timestamp, body);

    sinon.stub(slackApi, "post").returns(Promise.resolve({data: {ok: true}}));

    request(app)
      .post('/slack/event')
      .set('Content-type', 'application/json')
      .set('x-slack-request-timestamp', timestamp)
      .set('x-slack-signature', `v0=${signature}`)
      .send(body)
      .expect(200, {}, done);
  });

});
