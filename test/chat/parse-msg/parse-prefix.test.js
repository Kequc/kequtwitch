const assert = require('assert');
const parsePrefix = require('../../../src/chat/parse-msg/parse-prefix.js');

it('should return nulls when param is empty', function () {
    assert.deepStrictEqual(parsePrefix(null), { full: null, host: null, user: null });
    assert.deepStrictEqual(parsePrefix(''), { full: null, host: null, user: null });
    assert.deepStrictEqual(parsePrefix(), { full: null, host: null, user: null });
});

it('should trim the first character', function () {
    assert.deepStrictEqual(parsePrefix(':somevalue'), { full: 'somevalue', host: 'somevalue', user: null });
});

it('should find user', function () {
    assert.deepStrictEqual(parsePrefix(':ronni!ronni@ronni.tmi.twitch.tv'), { full: 'ronni!ronni@ronni.tmi.twitch.tv', host: 'ronni.tmi.twitch.tv', user: 'ronni' });
});

it('should find user when shorthand', function () {
    assert.deepStrictEqual(parsePrefix(':ronni.tmi.twitch.tv'), { full: 'ronni.tmi.twitch.tv', host: 'ronni.tmi.twitch.tv', user: 'ronni' });
});
