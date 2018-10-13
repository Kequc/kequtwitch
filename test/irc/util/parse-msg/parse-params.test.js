const parseParams = require('../../../../lib/irc/util/parse-msg/parse-params.js');

describe('parseParams', function () {
    test('should return empty when params is empty', function () {
        expect(parseParams(null)).toEqual([]);
        expect(parseParams('')).toEqual([]);
        expect(parseParams()).toEqual([]);
    });

    test('should return params', function () {
        expect(parseParams('other params')).toEqual(['other', 'params']);
    });

    test('should return one param if colon', function () {
        expect(parseParams(':Some text right here')).toEqual(['Some text right here']);
    });

    test('should return single param after colon', function () {
        expect(parseParams('other params :Some text right here')).toEqual(['other', 'params', 'Some text right here']);
    });

    test('should include all whitespace if colon', function () {
        expect(parseParams(':    Some    text    right    here    ')).toEqual(['    Some    text    right    here']);
    });

    test('should recover from extra whitespace', function () {
        expect(parseParams('other    params    :    Some    text    right    here    ')).toEqual(['other', 'params', '    Some    text    right    here']);
    });

    test('should handle single character params', function () {
        expect(parseParams('a b :c')).toEqual(['a', 'b', 'c']);
    });
});
