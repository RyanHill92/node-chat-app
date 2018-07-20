const expect = require('expect');
const {isRealString} = require('./validator');

describe('isRealString validator function', () => {
  it('should reject non-string values', () => {
    let nonString = 234;
    expect(isRealString(nonString)).toBe(false);
  });
  it('should reject a string made only of spaces', () => {
    let emptyString = '     ';
    expect(isRealString(emptyString)).toBe(false);
  });
  it('should allow a string of non-space characters', () => {
    let realString = 'H1, my name is Ry@n.';
    expect(isRealString(realString)).toBe(true);
  });
});
