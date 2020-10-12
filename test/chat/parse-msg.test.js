const parseMsg = require('../../src/chat/parse-msg.js');

describe('parseMsg', function () {
    test('should parse a message', function () {
        const raw = ':ronni!ronni@ronni.tmi.twitch.tv PRIVMSG #dallas :cheer100';
        expect(parseMsg(raw)).toEqual({
            raw,
            tags: {},
            prefix: { full: 'ronni!ronni@ronni.tmi.twitch.tv', host: 'ronni.tmi.twitch.tv', user: 'ronni' },
            command: 'PRIVMSG',
            params: ['#dallas', 'cheer100'],
            channel: '#dallas',
            message: 'cheer100',
            extended: {}
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
            channel: null,
            message: null,
            extended: {}
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
            channel: null,
            message: null,
            extended: {}
        });
    });

    test('should return malformed if command is invalid', function () {
        const raw = 'CO66ND params hello';
        expect(parseMsg(raw)).toEqual({
            raw,
            malformed: true,
            tags: {},
            prefix: {},
            command: 'UNKNOWN',
            params: [],
            channel: null,
            message: null,
            extended: {}
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
            channel: '#dallas',
            message: 'cheer100',
            extended: {}
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
            channel: '#dallas',
            message: 'cheer100',
            extended: {}
        });
    });
});
