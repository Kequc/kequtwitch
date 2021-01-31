const assert = require('assert');
const parseGeneric = require('../../../../src/chat/parse-msg/parse-tags/parse-generic.js');

it('should parse numbers', function () {
    assert.strictEqual(parseGeneric('1000'), 1000);
    assert.strictEqual(parseGeneric('1'), 1);
    assert.strictEqual(parseGeneric('-1'), -1);
    assert.strictEqual(parseGeneric('0'), 0);
    assert.strictEqual(parseGeneric('07'), 7);
});

it('should return strings', function () {
    assert.strictEqual(parseGeneric('hello'), 'hello');
});

it('should sanitise strings', function () {
    assert.strictEqual(parseGeneric('String\\swith\\sspaces'), 'String with spaces');
    assert.strictEqual(parseGeneric('Ignore\\n!'), 'Ignore!');
});
