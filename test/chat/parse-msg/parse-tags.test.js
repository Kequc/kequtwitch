const assert = require('assert');
const parseTags = require('../../../src/chat/parse-msg/parse-tags.js');

it('should return empty if raw is empty', function () {
    assert.deepStrictEqual(parseTags(null), {});
    assert.deepStrictEqual(parseTags(''), {});
    assert.deepStrictEqual(parseTags(), {});
});

it('should return empty no valid tags', function () {
    const raw = '@;;;';
    assert.deepStrictEqual(parseTags(raw), {});
});

it('should parse a tag', function () {
    const raw = '@hi=there';
    assert.deepStrictEqual(parseTags(raw), { hi: 'there' });
});

it('should parse multiple tags', function () {
    const raw = '@hi=there;how=areyou';
    assert.deepStrictEqual(parseTags(raw), { hi: 'there', how: 'areyou' });
});

it('should parse tags without values', function () {
    const raw = '@hi=;how=areyou';
    assert.deepStrictEqual(parseTags(raw), { hi: null, how: 'areyou' });
});

it('should convert tags using number values', function () {
    const raw = '@hi=1;how=0';
    assert.deepStrictEqual(parseTags(raw), { hi: 1, how: 0 });
});

it('should handle lots of tags', function () {
    const raw = '@badges=staff/1,bits/1000;bits=100;color=;display-name=dallas;emotes=;id=b34ccfc7-4977-403a-8a94-33c6bac34fb8;mod=0;room-id=1337;subscriber=0;tmi-sent-ts=1507246572675;turbo=1;user-id=7331;user-type=staff';
    assert.deepStrictEqual(parseTags(raw), {
        badges: ['staff/1', 'bits/1000'],
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
