const server = require('./server');

server.listen(process.env.PORT | 3000, () => {
  console.log('Listening...')
});


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

let res = await engine.say({username: 'john', text: 'hello'});
expect(res).toEqual({username: 'john', text: 'Hi, john', });

*/