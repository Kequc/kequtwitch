function findPositionIndexes (raw) {
    let tags = raw.search(/(?:^|\s)@\S+/);
    let prefix = raw.search(/(?:^|\s):\S+/);
    let command = raw.search(/(?:^|\s)(?:[A-Z]{3,}|[0-9]{3})(?:\s|$)/);
    let params = -1;

    // Check if malformed
    if (command === -1) {
        return null;
    }

    // Remove leading whitespace
    if (tags > -1 && raw[tags] === ' ') tags++;
    if (prefix > -1 && raw[prefix] === ' ') prefix++;
    if (raw[command] === ' ') command++;

    // Params appear after command
    params = raw.substring(command).search(/\s\S/);
    if (params > -1) params += command + 1; // And remove leading whitespace

    // Tags come before command
    if (tags > command) tags = -1;
    // Params and prefix are not the same
    if (params === prefix) prefix = -1;

    return { tags, prefix, command, params };
}

module.exports = findPositionIndexes;
