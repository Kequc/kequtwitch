const parseEmotes = require('../../../lib/irc/util/parse-emotes');

describe('parseEmotes', function () {
    test('should return null', function () {
        expect(parseEmotes(null)).toBeNull();
    });

    test('should return an emote', function () {
        expect(parseEmotes('11:0-6')).toEqual([
            { id: 11, start: 0, end: 6, length: 6 }
        ]);
    });

    test('should return multiple places', function () {
        expect(parseEmotes('11:0-6,9-13')).toEqual([
            { id: 11, start: 0, end: 6, length: 6 },
            { id: 11, start: 9, end: 13, length: 4 }
        ]);
    });

    test('should return multiple emotes', function () {
        expect(parseEmotes('11:0-6/406:9-13')).toEqual([
            { id: 11, start: 0, end: 6, length: 6 },
            { id: 406, start: 9, end: 13, length: 4 }
        ]);
    });

    test('should return lots of emotes', function () {
        expect(parseEmotes('171686:29-37,75-83,121-129,167-175/789949:0-3,46-49,92-95,138-141/839578:5-10,22-27,39-44,51-56,68-73,85-90,97-102,114-119,131-136,143-148,160-165,177-182/166449:12-20,58-66,104-112,150-158')).toEqual([
            { id: 171686, start: 29, end: 37, length: 8 },
            { id: 171686, start: 75, end: 83, length: 8 },
            { id: 171686, start: 121, end: 129, length: 8 },
            { id: 171686, start: 167, end: 175, length: 8 },
            { id: 789949, start: 0, end: 3, length: 3 },
            { id: 789949, start: 46, end: 49, length: 3 },
            { id: 789949, start: 92, end: 95, length: 3 },
            { id: 789949, start: 138, end: 141, length: 3 },
            { id: 839578, start: 5, end: 10, length: 5 },
            { id: 839578, start: 22, end: 27, length: 5 },
            { id: 839578, start: 39, end: 44, length: 5 },
            { id: 839578, start: 51, end: 56, length: 5 },
            { id: 839578, start: 68, end: 73, length: 5 },
            { id: 839578, start: 85, end: 90, length: 5 },
            { id: 839578, start: 97, end: 102, length: 5 },
            { id: 839578, start: 114, end: 119, length: 5 },
            { id: 839578, start: 131, end: 136, length: 5 },
            { id: 839578, start: 143, end: 148, length: 5 },
            { id: 839578, start: 160, end: 165, length: 5 },
            { id: 839578, start: 177, end: 182, length: 5 },
            { id: 166449, start: 12, end: 20, length: 8 },
            { id: 166449, start: 58, end: 66, length: 8 },
            { id: 166449, start: 104, end: 112, length: 8 },
            { id: 166449, start: 150, end: 158, length: 8 }
        ]);
    });
});
