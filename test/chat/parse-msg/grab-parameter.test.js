const assert = require('assert');
const grabParameter = require('../../../src/chat/parse-msg/grab-parameter.js');

let raw;

beforeEach(function () {
    raw = ':ronni!ronni@ronni.tmi.twitch.tv PRIVMSG #dallas :cheer100';
});

it('should return null if index is -1', function () {
    assert.strictEqual(grabParameter(raw, -1), null);
});

it('should return a parameter from the start of a string', function () {
    const start = 0;
    const expected = raw.substring(start, raw.indexOf(' '));
    assert.ok(expected.length > 0);
    assert.strictEqual(grabParameter(raw, start), expected);
});

it('should return a parameter from the middle of a string', function () {
    const start = raw.indexOf('PRIVMSG');
    assert.ok(start > -1);
    assert.strictEqual(grabParameter(raw, start), 'PRIVMSG');
});

it('should return a parameter from the end of a string', function () {
    const start = raw.indexOf(':cheer100');
    assert.ok(start > -1);
    assert.strictEqual(grabParameter(raw, start), ':cheer100');
});

it('should recover from extra white space', function () {
    raw = ` ${raw} `.replace(/\s/g, '    ');
    const start1 = 4;
    const expected1 = raw.substring(start1, raw.indexOf(' ', 4));
    assert.strictEqual(grabParameter(raw, start1), expected1);
    const start2 = raw.indexOf(':cheer100');
    assert.ok(start2 > -1);
    assert.strictEqual(grabParameter(raw, start2), ':cheer100');
});
