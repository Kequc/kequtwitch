function parsePrefix (raw) {
    if (!raw) {
        return { full: null, host: null, user: null };
    }

    const full = raw.substring(1);
    let host = full;
    let user = null;

    // ronni!ronni@ronni.tmi.twitch.tv
    if (/\.tmi\.twitch\.tv$/.test(full)) {
        host = full.substring(full.indexOf('@') + 1);
        user = host.split('.')[0];
    }

    return { full, host, user };
}

module.exports = parsePrefix;
