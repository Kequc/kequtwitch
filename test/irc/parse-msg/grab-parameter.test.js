const grabParameter = require('../../../src/irc/parse-msg/grab-parameter.js');

describe('grabParameter', function () {
    let raw;

    beforeEach(function () {
        raw = ':ronni!ronni@ronni.tmi.twitch.tv PRIVMSG #dallas :cheer100';
    });

    test('should return null if index is -1', function () {
        expect(grabParameter(raw, -1)).toBe(null);
    });

    test('should return a parameter from the start of a string', function () {
        const start = 0;
        const expected = raw.substring(start, raw.indexOf(' '));
        expect(expected.length).toBeGreaterThan(0);
        expect(grabParameter(raw, start)).toBe(expected);
    });

    test('should return a parameter from the middle of a string', function () {
        const start = raw.indexOf('PRIVMSG');
        expect(start).toBeGreaterThan(-1);
        expect(grabParameter(raw, start)).toBe('PRIVMSG');
    });

    test('should return a parameter from the end of a string', function () {
        const start = raw.indexOf(':cheer100');
        expect(start).toBeGreaterThan(-1);
        expect(grabParameter(raw, start)).toBe(':cheer100');
    });

    test('should recover from extra white space', function () {
        raw = ` ${raw} `.replace(/\s/g, '    ');
        const start1 = 4;
        const expected1 = raw.substring(start1, raw.indexOf(' ', 4));
        expect(grabParameter(raw, start1)).toBe(expected1);
        const start2 = raw.indexOf(':cheer100');
        expect(start2).toBeGreaterThan(-1);
        expect(grabParameter(raw, start2)).toBe(':cheer100');
    });
});
