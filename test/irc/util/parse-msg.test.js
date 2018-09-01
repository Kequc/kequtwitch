const { grabParameter, parsePrefix, parseParams, findPositionIndexes, parseMsg } = require('../../../lib/irc/util/parse-msg');

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

describe('parsePrefix', function () {
    test('should return nulls when param is empty', function () {
        expect(parsePrefix(null)).toEqual({ full: null, host: null, user: null });
        expect(parsePrefix('')).toEqual({ full: null, host: null, user: null });
        expect(parsePrefix()).toEqual({ full: null, host: null, user: null });
    });

    test('should trim the first character', function () {
        expect(parsePrefix(':somevalue')).toEqual({ full: 'somevalue', host: 'somevalue', user: null });
    });

    test('should find user', function () {
        expect(parsePrefix(':ronni!ronni@ronni.tmi.twitch.tv')).toEqual({ full: 'ronni!ronni@ronni.tmi.twitch.tv', host: 'ronni.tmi.twitch.tv', user: 'ronni' });
    });

    test('should find user when shorthand', function () {
        expect(parsePrefix(':ronni.tmi.twitch.tv')).toEqual({ full: 'ronni.tmi.twitch.tv', host: 'ronni.tmi.twitch.tv', user: 'ronni' });
    });
});

describe('parseParams', function () {
    test('should return empty when params is empty', function () {
        expect(parseParams(null)).toEqual([]);
        expect(parseParams('')).toEqual([]);
        expect(parseParams()).toEqual([]);
    });

    test('should return params', function () {
        expect(parseParams('other params')).toEqual(['other', 'params']);
    });

    test('should return one param if colon', function () {
        expect(parseParams(':Some text right here')).toEqual(['Some text right here']);
    });

    test('should return single param after colon', function () {
        expect(parseParams('other params :Some text right here')).toEqual(['other', 'params', 'Some text right here']);
    });

    test('should include all whitespace if colon', function () {
        expect(parseParams(':    Some    text    right    here    ')).toEqual(['    Some    text    right    here']);
    });

    test('should recover from extra whitespace', function () {
        expect(parseParams('other    params    :    Some    text    right    here    ')).toEqual(['other', 'params', '    Some    text    right    here']);
    });

    test('should handle single character params', function () {
        expect(parseParams('a b :c')).toEqual(['a', 'b', 'c']);
    });
});

describe('findPositionIndexes', function () {
    test('should find positions', function () {
        const raw = ':ronni!ronni@ronni.tmi.twitch.tv PRIVMSG #dallas :cheer100';
        expect(findPositionIndexes(raw)).toEqual({
            tags: -1,
            prefix: 0,
            command: raw.indexOf('PRIVMSG'),
            params: raw.indexOf('#dallas')
        });
    });

    test('should recover from extra whitespace', function () {
        const raw = ' :ronni!ronni@ronni.tmi.twitch.tv PRIVMSG #dallas :cheer100 '.replace(/\s/g, '    ');
        expect(findPositionIndexes(raw)).toEqual({
            tags: -1,
            prefix: 4,
            command: raw.indexOf('PRIVMSG'),
            params: raw.indexOf('#dallas')
        });
    });

    test('should find positions if command is a number', function () {
        const raw = ':tmi.twitch.tv 001';
        expect(findPositionIndexes(raw)).toEqual({
            tags: -1,
            prefix: 0,
            command: raw.indexOf('001'),
            params: -1
        });
    });

    test('should return malformed if command is a mixture of letters and numbers', function () {
        const raw = ':tmi.twitch.tv 0A01';
        expect(findPositionIndexes(raw)).toBe(null);
    });

    test('should recover from extra whitespace without params', function () {
        const raw = ' :tmi.twitch.tv COMMAND '.replace(/\s/g, '    ');
        expect(findPositionIndexes(raw)).toEqual({
            tags: -1,
            prefix: 4,
            command: raw.indexOf('COMMAND'),
            params: -1
        });
    });

    test('should find positions with tags', function () {
        const tags = '@hi=;how=areyou';
        const privmsg = ':ronni!ronni@ronni.tmi.twitch.tv PRIVMSG #dallas :cheer100';
        const raw = `${tags} ${privmsg}`;
        expect(findPositionIndexes(raw)).toEqual({
            tags: 0,
            prefix: raw.indexOf(privmsg),
            command: raw.indexOf('PRIVMSG'),
            params: raw.indexOf('#dallas')
        });
    });

    test('should recover from extra whitespace with tags', function () {
        const tags = '@hi=;how=areyou';
        const privmsg = ':ronni!ronni@ronni.tmi.twitch.tv PRIVMSG #dallas :cheer100';
        const raw = ` ${tags} ${privmsg} `.replace(/\s/g, '    ');
        expect(findPositionIndexes(raw)).toEqual({
            tags: 4,
            prefix: raw.indexOf(privmsg.substring(0, 10)),
            command: raw.indexOf('PRIVMSG'),
            params: raw.indexOf('#dallas')
        });
    });

    test('should find tags if there is no prefix', function () {
        const raw = '@hi=;how=areyou COMMAND params';
        expect(findPositionIndexes(raw)).toEqual({
            tags: 0,
            prefix: -1,
            command: raw.indexOf('COMMAND'),
            params: raw.indexOf('params')
        });
    });

    test('should find command if there is no prefix', function () {
        const raw = 'COMMAND params';
        expect(findPositionIndexes(raw)).toEqual({
            tags: -1,
            prefix: -1,
            command: 0,
            params: raw.indexOf('params')
        });
    });

    test('should find params if there is no prefix', function () {
        const raw = 'COMMAND :params';
        expect(findPositionIndexes(raw)).toEqual({
            tags: -1,
            prefix: -1,
            command: 0,
            params: raw.indexOf(':params')
        });
    });

    test('should recover from extra whitespace when there is no prefix', function () {
        const raw = ' COMMAND params '.replace(/\s/g, '    ');
        expect(findPositionIndexes(raw)).toEqual({
            tags: -1,
            prefix: -1,
            command: 4,
            params: raw.indexOf('params')
        });
    });

    test('should correct for @ symbol in params', function () {
        const raw = 'COMMAND @hi';
        expect(findPositionIndexes(raw)).toEqual({
            tags: -1,
            prefix: -1,
            command: 0,
            params: raw.indexOf('@hi')
        });
    });
});

describe('parseMsg', function () {
    test('should parse a message', function () {
        const raw = ':ronni!ronni@ronni.tmi.twitch.tv PRIVMSG #dallas :cheer100';
        expect(parseMsg(raw)).toEqual({
            raw,
            tags: {},
            prefix: { full: 'ronni!ronni@ronni.tmi.twitch.tv', host: 'ronni.tmi.twitch.tv', user: 'ronni' },
            command: 'PRIVMSG',
            params: ['#dallas', 'cheer100'],
            inferred: {}
        });
    });

    test('should parse a message if there is no prefix', function () {
        const raw = 'COMMAND params hello';
        expect(parseMsg(raw)).toEqual({
            raw,
            tags: {},
            prefix: { full: null, host: null, user: null },
            command: 'COMMAND',
            params: ['params', 'hello'],
            inferred: {}
        });
    });

    test('should parse a message if there is no params', function () {
        const raw = ':tmi.twitch.tv COMMAND';
        expect(parseMsg(raw)).toEqual({
            raw,
            tags: {},
            prefix: { full: 'tmi.twitch.tv', host: 'tmi.twitch.tv', user: null },
            command: 'COMMAND',
            params: [],
            inferred: {}
        });
    });

    test('should return malformed if command is invalid', function () {
        const raw = 'CO66ND params hello';
        expect(parseMsg(raw)).toEqual({
            raw,
            malformed: true,
            tags: {},
            prefix: {},
            params: [],
            inferred: {}
        });
    });

    test('should parse a message with tags', function () {
        const tags = '@hi=;how=areyou';
        const privmsg = ':ronni!ronni@ronni.tmi.twitch.tv PRIVMSG #dallas :cheer100';
        const raw = `${tags} ${privmsg}`;
        expect(parseMsg(raw)).toEqual({
            raw,
            tags: { hi: null, how: 'areyou' },
            prefix: { full: 'ronni!ronni@ronni.tmi.twitch.tv', host: 'ronni.tmi.twitch.tv', user: 'ronni' },
            command: 'PRIVMSG',
            params: ['#dallas', 'cheer100'],
            inferred: {}
        });
    });

    test('should recover from extra whitespace', function () {
        const tags = '@hi=;how=areyou';
        const privmsg = ':ronni!ronni@ronni.tmi.twitch.tv PRIVMSG #dallas :cheer100';
        const raw = ` ${tags} ${privmsg} `.replace(/\s/g, '    ');
        expect(parseMsg(raw)).toEqual({
            raw,
            tags: { hi: null, how: 'areyou' },
            prefix: { full: 'ronni!ronni@ronni.tmi.twitch.tv', host: 'ronni.tmi.twitch.tv', user: 'ronni' },
            command: 'PRIVMSG',
            params: ['#dallas', 'cheer100'],
            inferred: {}
        });
    });
});
