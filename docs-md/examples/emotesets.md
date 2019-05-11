# Emotesets

Fetching emotesets whenever they are updated can be relatively simple. We might use this if we were parsing messages to use emoticons and always want to keep them up to date.

Add a quick extension that watches for a change and fetches the new emotes from [get emoticons by set](https://dev.twitch.tv/docs/v5/reference/chat/#get-chat-emoticons-by-set).

```javascript
let lastEmotesets;

async function checkEmotesets (msg) {
    // look for new emotesets
    if (!Array.isArray(msg.tags.emoteSets)) {
        return;
    }

    const emotesets = msg.tags.emoteSets.join(',');

    // emotesets haven't changed
    if (lastEmotesets === emotesets) {
        return;
    }
    lastEmotesets = emotesets;

    // fetch
    const result = await twitch.api.request('/chat/emoticon_images', {
        data: { emotesets },
        kraken: true
    });

    // emit result
    handleEmotesets(result.emoticonSets);
}

function handleEmotesets (emotesets) {
    // updated emotes arrived!
}

twitch.chat.on('USERSTATE', checkEmotesets);
twitch.chat.on('GLOBALUSERSTATE', checkEmotesets);
```

Quick tip: Emote urls are `https://static-cdn.jtvnw.net/emoticons/v1/${id}/1.0` where `${id}` is your character code id.