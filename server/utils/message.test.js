const expect = require('expect');
const {generateMessage, generateLocationMessage} = require('./message');

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

describe('generateLocationMessage', () => {
  it('should generate correct location object', () => {
    let from = 'Test Client';
    let latitude = 50;
    let longitude = -80;
    let locObj = generateLocationMessage(from, latitude, longitude);
    expect(typeof locObj).toBe('object');
    expect(locObj).toMatchObject({from, url: `https://www.google.com/maps/?q=${latitude},${longitude}`});
    expect(typeof locObj.createdAt).toBe('number');
  });
});
