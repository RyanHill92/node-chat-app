const expect = require('expect');
const {generateMessage} = require('./message');

describe('generateMessage', () => {
  it('should return a message object', () => {
    let text = 'This is a test message.';
    let from = 'Test Messenger';
    let msg = generateMessage(from, text);
    expect(msg.from).toBe(from);
    expect(msg.text).toBe(text);
    expect(typeof msg.createdAt).toBe('number');
  });
});
