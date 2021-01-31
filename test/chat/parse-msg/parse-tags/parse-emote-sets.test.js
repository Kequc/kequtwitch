const assert = require('assert');
const parseEmoteSets = require('../../../../src/chat/parse-msg/parse-tags/parse-emote-sets.js');

it('should return null', function () {
    assert.strictEqual(parseEmoteSets(null), null);
});

it('should return an emoteSet', function () {
    assert.deepStrictEqual(parseEmoteSets('0'), [0]);
    assert.deepStrictEqual(parseEmoteSets('1000'), [1000]);
});

it('should return multiple', function () {
    assert.deepStrictEqual(parseEmoteSets('1,554'), [1, 554]);
});
