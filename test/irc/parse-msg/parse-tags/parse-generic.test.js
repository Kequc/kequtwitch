const parseGeneric = require('../../../../src/irc/parse-msg/parse-tags/parse-generic.js');

describe('parseGeneric', function () {
    test('should parse numbers', function () {
        expect(parseGeneric('1000')).toBe(1000);
        expect(parseGeneric('1')).toBe(1);
        expect(parseGeneric('-1')).toBe(-1);
        expect(parseGeneric('0')).toBe(0);
        expect(parseGeneric('07')).toBe(7);
    });

    test('should return strings', function () {
        expect(parseGeneric('hello')).toBe('hello');
    });

    test('should sanitise strings', function () {
        expect(parseGeneric('String\\swith\\sspaces')).toBe('String with spaces');
        expect(parseGeneric('Ignore\\n!')).toBe('Ignore!');
    });
});
