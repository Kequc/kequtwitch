# Followers

A common interest is when someone new follows your channel, unfortunately this is only achievable through HTTP endpoints currently. You would need to use webhooks or poll the [/users/follows](https://dev.twitch.tv/docs/api/reference/#get-users-follows) url.

This solution uses polling to find new user ids, then looks up those users.

```javascript
let lastCheckedAt = Date.now();

function isNewFollow (follow) {
    return new Date(follow.followedAt).getTime() > lastCheckedAt;
}

async function checkFollowers () {
    // fetch
    const follows = await twitch.api.request('/users/follows', {
        data: { toId: '$userId' }
    });

    const userIds = follows.filter(isNewFollow).map(follow => follow.fromId);
    lastCheckedAt = Date.now();

    if (userIds.length < 1) {
        return;
    }

    const followers = await twitch.api.request('/users', {
        data: { id: userIds }
    })

    for (const follower of followers) {
        handleFollower(follower);
    }
}

function handleFollower (follower) {
    const displayName = follower.displayName;

    console.log(`New follower: ${displayName}!`);
}

// 2 minutes
setInterval(checkFollowers, 1000 * 60 * 2);
