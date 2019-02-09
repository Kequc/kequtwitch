function parseEmotes (value) {
    if (typeof value !== 'string') return value;

    const result = [];

    for (const part of value.split('/')) {
        const [_id, places] = part.split(':');
        const id = parseInt(_id, 10);
        for (const place of places.split(',')) {
            result.push(buildEmote(id, place));
        }
    }

    return result;
}

function buildEmote (id, place) {
    const [_start, _end] = place.split('-');
    const start = parseInt(_start, 10);
    const end = parseInt(_end, 10);
    return { id, start, end, length: end - start };
}

module.exports = parseEmotes;
