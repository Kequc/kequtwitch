const assert = require('assert');
const parseMsg = require('../../src/chat/parse-msg.js');

it('should parse a message', function () {
    const raw = ':ronni!ronni@ronni.tmi.twitch.tv PRIVMSG #dallas :cheer100';
    assert.deepStrictEqual(parseMsg(raw), {
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

it('should parse a message if there is no prefix', function () {
    const raw = 'COMMAND params hello';
    assert.deepStrictEqual(parseMsg(raw), {
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

it('should parse a message if there is no params', function () {
    const raw = ':tmi.twitch.tv COMMAND';
    assert.deepStrictEqual(parseMsg(raw), {
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

it('should return malformed if command is invalid', function () {
    const raw = 'CO66ND params hello';
    assert.deepStrictEqual(parseMsg(raw), {
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

it('should parse a message with tags', function () {
    const tags = '@hi=;how=areyou';
    const privmsg = ':ronni!ronni@ronni.tmi.twitch.tv PRIVMSG #dallas :cheer100';
    const raw = `${tags} ${privmsg}`;
    assert.deepStrictEqual(parseMsg(raw), {
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

it('should recover from extra whitespace', function () {
    const tags = '@hi=;how=areyou';
    const privmsg = ':ronni!ronni@ronni.tmi.twitch.tv PRIVMSG #dallas :cheer100';
    const raw = ` ${tags} ${privmsg} `.replace(/\s/g, '    ');
    assert.deepStrictEqual(parseMsg(raw), {
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
