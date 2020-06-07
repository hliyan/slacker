const engine = require('./index');

describe('say', () => {
  test('says hello by default', async () => {
    let res = await engine.say({username: 'john', text: 'foo'});
    expect(res.username).toBe('john');
    expect(res.text).toBe('Hello?');
  });

  test('says hi if you say hello', async () => {
    let res = await engine.say({username: 'john', text: 'hello'});
    expect(res.username).toBe('john');
    expect(res.text).toBe('Hi, john');
  });
});