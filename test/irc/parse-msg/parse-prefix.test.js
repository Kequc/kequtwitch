const parsePrefix = require('../../../src/irc/parse-msg/parse-prefix.js');

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
