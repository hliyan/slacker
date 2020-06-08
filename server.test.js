const app = require('./server');
const request = require('supertest');

describe('GET /', () => {
  test('should return hello world', (done) => {
    request(app)
      .get('/')
      .expect('Content-Type', /json/)
      .expect(200, {hello: 'world'}, done)
  });
});

describe('POST /slack/event', () => {
  test('should respond to the challenge sent by slack', (done) => {
    request(app)
      .post('/slack/event')
      .send({type: 'url_verification', challenge: '12345000'})
      .set('Content-type', 'application/json')
      .expect(200, {challenge: '12345000'}, done);
  });

  test('should respond with 200 for unknown requests', (done) => {
    request(app)
    .post('/slack/event')
    .send({})
    .set('Content-type', 'application/json')
    .expect(200, {}, done);
  });
});