const app = require('./server');
const request = require('supertest');

describe('GET /', () => {
  test('should return hello world', (done) => {
    request(app)
      .get('/')
      .send({hello: 'world'})
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});