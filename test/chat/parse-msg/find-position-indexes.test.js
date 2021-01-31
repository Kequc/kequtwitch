const assert = require('assert');
const findPositionIndexes = require('../../../src/chat/parse-msg/find-position-indexes.js');

it('should find positions', function () {
    const raw = ':ronni!ronni@ronni.tmi.twitch.tv PRIVMSG #dallas :cheer100';
    assert.deepStrictEqual(findPositionIndexes(raw), {
        tags: -1,
        prefix: 0,
        command: raw.indexOf('PRIVMSG'),
        params: raw.indexOf('#dallas')
    });
});

it('should recover from extra whitespace', function () {
    const raw = ' :ronni!ronni@ronni.tmi.twitch.tv PRIVMSG #dallas :cheer100 '.replace(/\s/g, '    ');
    assert.deepStrictEqual(findPositionIndexes(raw), {
        tags: -1,
        prefix: 4,
        command: raw.indexOf('PRIVMSG'),
        params: raw.indexOf('#dallas')
    });
});

it('should find positions if command is a number', function () {
    const raw = ':tmi.twitch.tv 001';
    assert.deepStrictEqual(findPositionIndexes(raw), {
        tags: -1,
        prefix: 0,
        command: raw.indexOf('001'),
        params: -1
    });
});

it('should return malformed if command is a mixture of letters and numbers', function () {
    const raw = ':tmi.twitch.tv 0A01';
    assert.strictEqual(findPositionIndexes(raw), null);
});

it('should recover from extra whitespace without params', function () {
    const raw = ' :tmi.twitch.tv COMMAND '.replace(/\s/g, '    ');
    assert.deepStrictEqual(findPositionIndexes(raw), {
        tags: -1,
        prefix: 4,
        command: raw.indexOf('COMMAND'),
        params: -1
    });
});

it('should find positions with tags', function () {
    const tags = '@hi=;how=areyou';
    const privmsg = ':ronni!ronni@ronni.tmi.twitch.tv PRIVMSG #dallas :cheer100';
    const raw = `${tags} ${privmsg}`;
    assert.deepStrictEqual(findPositionIndexes(raw), {
        tags: 0,
        prefix: raw.indexOf(privmsg),
        command: raw.indexOf('PRIVMSG'),
        params: raw.indexOf('#dallas')
    });
});

it('should recover from extra whitespace with tags', function () {
    const tags = '@hi=;how=areyou';
    const privmsg = ':ronni!ronni@ronni.tmi.twitch.tv PRIVMSG #dallas :cheer100';
    const raw = ` ${tags} ${privmsg} `.replace(/\s/g, '    ');
    assert.deepStrictEqual(findPositionIndexes(raw), {
        tags: 4,
        prefix: raw.indexOf(privmsg.substring(0, 10)),
        command: raw.indexOf('PRIVMSG'),
        params: raw.indexOf('#dallas')
    });
});

it('should find tags if there is no prefix', function () {
    const raw = '@hi=;how=areyou COMMAND params';
    assert.deepStrictEqual(findPositionIndexes(raw), {
        tags: 0,
        prefix: -1,
        command: raw.indexOf('COMMAND'),
        params: raw.indexOf('params')
    });
});

it('should find command if there is no prefix', function () {
    const raw = 'COMMAND params';
    assert.deepStrictEqual(findPositionIndexes(raw), {
        tags: -1,
        prefix: -1,
        command: 0,
        params: raw.indexOf('params')
    });
});

it('should find params if there is no prefix', function () {
    const raw = 'COMMAND :params';
    assert.deepStrictEqual(findPositionIndexes(raw), {
        tags: -1,
        prefix: -1,
        command: 0,
        params: raw.indexOf(':params')
    });
});

it('should recover from extra whitespace when there is no prefix', function () {
    const raw = ' COMMAND params '.replace(/\s/g, '    ');
    assert.deepStrictEqual(findPositionIndexes(raw), {
        tags: -1,
        prefix: -1,
        command: 4,
        params: raw.indexOf('params')
    });
});

it('should correct for @ symbol in params', function () {
    const raw = 'COMMAND @hi';
    assert.deepStrictEqual(findPositionIndexes(raw), {
        tags: -1,
        prefix: -1,
        command: 0,
        params: raw.indexOf('@hi')
    });
});
