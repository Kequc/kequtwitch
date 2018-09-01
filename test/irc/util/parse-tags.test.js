const { emoteSets, generic, tagValue, parseTags } = require('../../../lib/irc/util/parse-tags');

describe('emoteSets', function () {
    test('should return the value', function () {
        expect(emoteSets('hello')).toBe('hello');
        expect(emoteSets('1000')).toBe('1000');
        expect(emoteSets('1')).toBe('1');
        expect(emoteSets('0')).toBe('0');
        expect(emoteSets('')).toBe('');
    });
});

describe('generic', function () {
    test('should parse numbers', function () {
        expect(generic('1000')).toBe(1000);
        expect(generic('1')).toBe(1);
        expect(generic('-1')).toBe(-1);
        expect(generic('0')).toBe(0);
        expect(generic('07')).toBe(7);
    });

    test('should return strings', function () {
        expect(generic('hello')).toBe('hello');
    });

    test('should sanitise strings', function () {
        expect(generic('String\\swith\\sspaces')).toBe('String with spaces');
        expect(generic('Ignore\\n!')).toBe('Ignore!');
    });
});

describe('tagValue', function () {
    test('should return null if value is empty', function () {
        expect(tagValue('anything', null)).toBe(null);
        expect(tagValue('anything', '')).toBe(null);
        expect(tagValue('anything')).toBe(null);
    });

    test('should parse numbers and strings', function () {
        expect(tagValue('anything', 'hello')).toBe('hello');
        expect(tagValue('anything', '1000')).toBe(1000);
    });

    test('should parse emoteSets', function () {
        expect(tagValue('emote-sets', '1000')).toBe('1000');
    });
});

describe('parseTags', function () {
    test('should return empty if raw is empty', function () {
        expect(parseTags(null)).toEqual({});
        expect(parseTags('')).toEqual({});
        expect(parseTags()).toEqual({});
    });

    test('should return empty no valid tags', function () {
        const raw = '@;;;';
        expect(parseTags(raw)).toEqual({});
    });

    test('should parse a tag', function () {
        const raw = '@hi=there';
        expect(parseTags(raw)).toEqual({ hi: 'there' });
    });

    test('should parse multiple tags', function () {
        const raw = '@hi=there;how=areyou';
        expect(parseTags(raw)).toEqual({ hi: 'there', how: 'areyou' });
    });

    test('should parse tags without values', function () {
        const raw = '@hi=;how=areyou';
        expect(parseTags(raw)).toEqual({ hi: null, how: 'areyou' });
    });

    test('should convert tags using number values', function () {
        const raw = '@hi=1;how=0';
        expect(parseTags(raw)).toEqual({ hi: 1, how: 0 });
    });

    test('should handle lots of tags', function () {
        const raw = '@badges=staff/1,bits/1000;bits=100;color=;display-name=dallas;emotes=;id=b34ccfc7-4977-403a-8a94-33c6bac34fb8;mod=0;room-id=1337;subscriber=0;tmi-sent-ts=1507246572675;turbo=1;user-id=7331;user-type=staff';
        expect(parseTags(raw)).toEqual({
            badges: 'staff/1,bits/1000',
            bits: 100,
            color: null,
            displayName: 'dallas',
            emotes: null,
            id: 'b34ccfc7-4977-403a-8a94-33c6bac34fb8',
            mod: 0,
            roomId: 1337,
            subscriber: 0,
            tmiSentTs: 1507246572675,
            turbo: 1,
            userId: 7331,
            userType: 'staff'
        });
    });
});
