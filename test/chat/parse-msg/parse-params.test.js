const assert = require('assert');
const parseParams = require('../../../src/chat/parse-msg/parse-params.js');

it('should return empty when params is empty', function () {
    assert.deepStrictEqual(parseParams(null), []);
    assert.deepStrictEqual(parseParams(''), []);
    assert.deepStrictEqual(parseParams(), []);
});

it('should return params', function () {
    assert.deepStrictEqual(parseParams('other params'), ['other', 'params']);
});

it('should return one param if colon', function () {
    assert.deepStrictEqual(parseParams(':Some text right here'), ['Some text right here']);
});

it('should return single param after colon', function () {
    assert.deepStrictEqual(parseParams('other params :Some text right here'), ['other', 'params', 'Some text right here']);
});

it('should include all whitespace if colon', function () {
    assert.deepStrictEqual(parseParams(':    Some    text    right    here    '), ['    Some    text    right    here']);
});

it('should recover from extra whitespace', function () {
    assert.deepStrictEqual(parseParams('other    params    :    Some    text    right    here    '), ['other', 'params', '    Some    text    right    here']);
});

it('should handle single character params', function () {
    assert.deepStrictEqual(parseParams('a b :c'), ['a', 'b', 'c']);
});
