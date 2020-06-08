const app = require('./server');
const request = require('supertest');

describe('GET /', () => {
  test('should return hello world', (done) => {
    request(app)
      .get('/')
      .expect('Content-Type', /json/)
      .expect(200, {hello: 'world'}, done);
  });
});