/*
const engine = require('./conversation-engine'); // engine with only business logic

// V1: trying event driven API

const mockSend = (options) => {};

engine.addEventListener('response', (e) => {
  mockSend({message: e.message, username: e.username});
});

engine.say({username: 'foo', message: 'hello', time: null});
expect(mockSend).toHaveBeenCalledWith({message: 'Hi, foo', username: 'foo'});

// V2: event driven was overkill, try simple awaits like everyone else

let res = await engine.as('john').say('hello');
expect(res).toEqual({message: 'Hi, john', username: 'foo'});

*/