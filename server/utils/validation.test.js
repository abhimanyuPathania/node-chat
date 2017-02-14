const expect = require('expect');

var {isRealString} = require('./validation');

describe('isRealString', () => {
	it ('should reject non string values', () => {
		expect(isRealString(1)).toBe(false);
		expect(isRealString({})).toBe(false);
	});

	it ('should reject string with only white spaces', () => {
		expect(isRealString(' ')).toBe(false);
	});

	it ('should allow string with non space white characters', () => {
		expect(isRealString('foo 123')).toBe(true);
	});
});