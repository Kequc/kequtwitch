# Followers

A common interest is when someone new follows your channel, unfortunately this is only achievable through http endpoints currently. You would need to use webhooks or poll the [/users/follows](https://dev.twitch.tv/docs/api/reference/#get-users-follows) url.

This solution uses polling to find new user ids, then looks up those users.

```javascript
// 2 minutes
setInterval(checkFollowers, 1000 * 60 * 2);
twitch.api.followsAt = Date.now();

async function checkFollowers () {
    // fetch
    const follows = await twitch.api.helix('/users/follows', {
        data: { toId: '$userId' }
    });

    const userIds = follows.data.filter(isNewFollow).map(follow => follow.fromId);
    twitch.api.followsAt = Date.now();

    // no new followers
    if (userIds.length < 1) {
        return;
    }

    // get user data
    const followers = await twitch.api.helix('/users', {
        data: { id: userIds }
    });

    // emit
    for (const follower of followers.data) {
        handleFollower(follower);
    }
}

function isNewFollow (follow) {
    return new Date(follow.followedAt).getTime() > twitch.api.followsAt;
}

// data arrived!
function handleFollower (follower) {
    const displayName = follower.displayName;

    console.log(`New follower: ${displayName}!`);
}
```
