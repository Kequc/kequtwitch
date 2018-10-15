# Followers

A common interest is when someone new follows your channel, unfortunately this is only achievable through HTTP endpoints currently. You would need to use webhooks or poll the [/users/follows](https://dev.twitch.tv/docs/api/reference/#get-users-follows) url.

This solution uses polling to find new user ids, then looks up those users.

```javascript
let lastCheckedAt = Date.now();
const INTERVAL = 1000 * 60 * 2; // 2 minutes

function isNewFollow (follow) {
    return new Date(follow.followed_at).getTime() > lastCheckedAt;
}

async function checkFollowers (msg) {
    // fetch
    const follows = await twitch.api.request('/users/follows', {
        data: { to_id: '$userId' }
    });

    const userIds = follows.filter(isNewFollow).map(follow => follow.from_id);
    lastCheckedAt += INTERVAL;

    if (userIds.length < 1) {
        return;
    }

    const followers = await twitch.api.request('/users', {
        data: { id: userIds }
    })

    for (const follower of followers) {
        // emit result
        twitch.irc.emit('follower', follower);
    }
}

setInterval(checkFollowers, INTERVAL);

twitch.irc.on('follower', function onFollower (follower) {
    const displayName = follower.display_name;

    console.log(`New follower: ${displayName}!`);
});
```
