const parseEmoteSets = require('../../../../src/chat/parse-msg/parse-tags/parse-emote-sets.js');

describe('parseEmoteSets', function () {
    test('should return null', function () {
        expect(parseEmoteSets(null)).toBeNull();
    });

    test('should return an emoteSet', function () {
        expect(parseEmoteSets('0')).toEqual([0]);
        expect(parseEmoteSets('1000')).toEqual([1000]);
    });

    test('should return multiple', function () {
        expect(parseEmoteSets('1,554')).toEqual([1, 554]);
    });
});
