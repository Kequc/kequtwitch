const parseEmoteSets = require('../../../../../lib/irc/util/parse-msg/parse-tags/parse-emote-sets.js');

describe('parseEmoteSets', function () {
    test('should return the value', function () {
        expect(parseEmoteSets('hello')).toBe('hello');
        expect(parseEmoteSets('1000')).toBe('1000');
        expect(parseEmoteSets('1')).toBe('1');
        expect(parseEmoteSets('0')).toBe('0');
        expect(parseEmoteSets('')).toBe('');
    });
});
