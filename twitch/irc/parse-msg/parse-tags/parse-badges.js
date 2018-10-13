function parseBadges (value) {
    if (typeof value !== 'string') return value;
    return value.split(',');
}

module.exports = parseBadges;
