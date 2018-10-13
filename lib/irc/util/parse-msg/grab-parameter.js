function grabParameter (raw, start) {
    if (start === -1) return null;
    const end = raw.substring(start).search(/\s/);

    if (end > -1) {
        return raw.substring(start, start + end);
    } else {
        return raw.substring(start);
    }
}

module.exports = grabParameter;
