const findPositionIndexes = require('../../../src/irc/parse-msg/find-position-indexes.js');

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
