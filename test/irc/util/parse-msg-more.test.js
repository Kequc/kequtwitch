const { parseMsg } = require('../../../lib/irc/util/parse-msg');

const EXAMPLES = {
    ':tmi.twitch.tv 001 ronni :Welcome, GLHF!': {
        tags: {},
        prefix: { full: 'tmi.twitch.tv', host: 'tmi.twitch.tv', user: null },
        command: '001',
        params: ['ronni', 'Welcome, GLHF!']
    },
    ':tmi.twitch.tv 002 ronni :Your host is tmi.twitch.tv': {
        tags: {},
        prefix: { full: 'tmi.twitch.tv', host: 'tmi.twitch.tv', user: null },
        command: '002',
        params: ['ronni', 'Your host is tmi.twitch.tv']
    },
    ':tmi.twitch.tv 003 ronni :This server is rather new': {
        tags: {},
        prefix: { full: 'tmi.twitch.tv', host: 'tmi.twitch.tv', user: null },
        command: '003',
        params: ['ronni', 'This server is rather new']
    },
    ':tmi.twitch.tv 004 ronni :-': {
        tags: {},
        prefix: { full: 'tmi.twitch.tv', host: 'tmi.twitch.tv', user: null },
        command: '004',
        params: ['ronni', '-']
    },
    ':tmi.twitch.tv 375 ronni :-': {
        tags: {},
        prefix: { full: 'tmi.twitch.tv', host: 'tmi.twitch.tv', user: null },
        command: '375',
        params: ['ronni', '-']
    },
    ':tmi.twitch.tv 372 ronni :You are in a maze of twisty passages.': {
        tags: {},
        prefix: { full: 'tmi.twitch.tv', host: 'tmi.twitch.tv', user: null },
        command: '372',
        params: ['ronni', 'You are in a maze of twisty passages.']
    },
    ':tmi.twitch.tv 376 ronni :>': {
        tags: {},
        prefix: { full: 'tmi.twitch.tv', host: 'tmi.twitch.tv', user: null },
        command: '376',
        params: ['ronni', '>']
    },
    'PING :tmi.twitch.tv': {
        tags: {},
        prefix: { full: null, host: null, user: null },
        command: 'PING',
        params: ['tmi.twitch.tv']
    },
    'PONG :tmi.twitch.tv': {
        tags: {},
        prefix: { full: null, host: null, user: null },
        command: 'PONG',
        params: ['tmi.twitch.tv']
    },
    ':ronni!ronni@ronni.tmi.twitch.tv JOIN #dallas': {
        tags: {},
        prefix: { full: 'ronni!ronni@ronni.tmi.twitch.tv', host: 'ronni.tmi.twitch.tv', user: 'ronni' },
        command: 'JOIN',
        params: ['#dallas']
    },
    ':jtv MODE #dallas +o ronni': {
        tags: {},
        prefix: { full: 'jtv', host: 'jtv', user: null },
        command: 'MODE',
        params: ['#dallas', '+o', 'ronni']
    },
    ':ronni.tmi.twitch.tv 353 ronni = #dallas :ronni fred wilma': {
        tags: {},
        prefix: { full: 'ronni.tmi.twitch.tv', host: 'ronni.tmi.twitch.tv', user: 'ronni' },
        command: '353',
        params: ['ronni', '=', '#dallas', 'ronni fred wilma']
    },
    ':ronni.tmi.twitch.tv 353 ronni = #dallas :barney betty': {
        tags: {},
        prefix: { full: 'ronni.tmi.twitch.tv', host: 'ronni.tmi.twitch.tv', user: 'ronni' },
        command: '353',
        params: ['ronni', '=', '#dallas', 'barney betty']
    },
    ':ronni.tmi.twitch.tv 366 ronni #dallas :End of /NAMES list': {
        tags: {},
        prefix: { full: 'ronni.tmi.twitch.tv', host: 'ronni.tmi.twitch.tv', user: 'ronni' },
        command: '366',
        params: ['ronni', '#dallas', 'End of /NAMES list']
    },
    ':ronni!ronni@ronni.tmi.twitch.tv PART #dallas': {
        tags: {},
        prefix: { full: 'ronni!ronni@ronni.tmi.twitch.tv', host: 'ronni.tmi.twitch.tv', user: 'ronni' },
        command: 'PART',
        params: ['#dallas']
    },
    ':tmi.twitch.tv CLEARCHAT #dallas': {
        tags: {},
        prefix: { full: 'tmi.twitch.tv', host: 'tmi.twitch.tv', user: null },
        command: 'CLEARCHAT',
        params: ['#dallas']
    },
    ':tmi.twitch.tv HOSTTARGET #hosting_channel dallas 100': {
        tags: {},
        prefix: { full: 'tmi.twitch.tv', host: 'tmi.twitch.tv', user: null },
        command: 'HOSTTARGET',
        params: ['#hosting_channel', 'dallas', '100']
    },
    ':tmi.twitch.tv HOSTTARGET #hosting_channel :- 100': {
        tags: {},
        prefix: { full: 'tmi.twitch.tv', host: 'tmi.twitch.tv', user: null },
        command: 'HOSTTARGET',
        params: ['#hosting_channel', '- 100']
    },
    ':tmi.twitch.tv HOSTTARGET #hosting_channel dallas': {
        tags: {},
        prefix: { full: 'tmi.twitch.tv', host: 'tmi.twitch.tv', user: null },
        command: 'HOSTTARGET',
        params: ['#hosting_channel', 'dallas']
    },
    ':tmi.twitch.tv HOSTTARGET #hosting_channel :-': {
        tags: {},
        prefix: { full: 'tmi.twitch.tv', host: 'tmi.twitch.tv', user: null },
        command: 'HOSTTARGET',
        params: ['#hosting_channel', '-']
    },
    '@msg-id=slow_off :tmi.twitch.tv NOTICE #dallas :This room is no longer in slow mode.': {
        tags: { msgId: 'slow_off' },
        prefix: { full: 'tmi.twitch.tv', host: 'tmi.twitch.tv', user: null },
        command: 'NOTICE',
        params: ['#dallas', 'This room is no longer in slow mode.']
    },
    ':tmi.twitch.tv ROOMSTATE #dallas': {
        tags: {},
        prefix: { full: 'tmi.twitch.tv', host: 'tmi.twitch.tv', user: null },
        command: 'ROOMSTATE',
        params: ['#dallas']
    },
    '@broadcaster-lang=en;r9k=0;slow=0;subs-only=0 :tmi.twitch.tv ROOMSTATE #dallas': {
        tags: { broadcasterLang: 'en', r9k: 0, slow: 0, subsOnly: 0 },
        prefix: { full: 'tmi.twitch.tv', host: 'tmi.twitch.tv', user: null },
        command: 'ROOMSTATE',
        params: ['#dallas']
    },
    '@slow=10 :tmi.twitch.tv ROOMSTATE #dallas': {
        tags: { slow: 10 },
        prefix: { full: 'tmi.twitch.tv', host: 'tmi.twitch.tv', user: null },
        command: 'ROOMSTATE',
        params: ['#dallas']
    },
    ':tmi.twitch.tv CLEARCHAT #dallas :ronni': {
        tags: {},
        prefix: { full: 'tmi.twitch.tv', host: 'tmi.twitch.tv', user: null },
        command: 'CLEARCHAT',
        params: ['#dallas', 'ronni']
    },
    '@ban-reason=Follow\\sthe\\srules :tmi.twitch.tv CLEARCHAT #dallas :ronni': {
        tags: { banReason: 'Follow the rules' },
        prefix: { full: 'tmi.twitch.tv', host: 'tmi.twitch.tv', user: null },
        command: 'CLEARCHAT',
        params: ['#dallas', 'ronni']
    },
    ':tmi.twitch.tv USERNOTICE #dallas :Usernotice message': {
        tags: {},
        prefix: { full: 'tmi.twitch.tv', host: 'tmi.twitch.tv', user: null },
        command: 'USERNOTICE',
        params: ['#dallas', 'Usernotice message']
    },
    ':tmi.twitch.tv USERSTATE #dallas': {
        tags: {},
        prefix: { full: 'tmi.twitch.tv', host: 'tmi.twitch.tv', user: null },
        command: 'USERSTATE',
        params: ['#dallas']
    },
    ':ronni!ronni@ronni.tmi.twitch.tv JOIN #chatrooms:44322889:04e762ec-ce8f-4cbc-b6a3-ffc871ab53da': {
        tags: {},
        prefix: { full: 'ronni!ronni@ronni.tmi.twitch.tv', host: 'ronni.tmi.twitch.tv', user: 'ronni' },
        command: 'JOIN',
        params: ['#chatrooms:44322889:04e762ec-ce8f-4cbc-b6a3-ffc871ab53da']
    },
    '@msg-id=slow_off :tmi.twitch.tv NOTICE #chatrooms:44322889:04e762ec-ce8f-4cbc-b6a3-ffc871ab53da :This room is no longer in slow mode.': {
        tags: { msgId: 'slow_off' },
        prefix: { full: 'tmi.twitch.tv', host: 'tmi.twitch.tv', user: null },
        command: 'NOTICE',
        params: ['#chatrooms:44322889:04e762ec-ce8f-4cbc-b6a3-ffc871ab53da', 'This room is no longer in slow mode.']
    },
    ':ronni!ronni@ronni.tmi.twitch.tv PRIVMSG #chatrooms:44322889:04e762ec-ce8f-4cbc-b6a3-ffc871ab53da :This is a sample message': {
        tags: {},
        prefix: { full: 'ronni!ronni@ronni.tmi.twitch.tv', host: 'ronni.tmi.twitch.tv', user: 'ronni' },
        command: 'PRIVMSG',
        params: ['#chatrooms:44322889:04e762ec-ce8f-4cbc-b6a3-ffc871ab53da', 'This is a sample message']
    },
    '@emote-only=0;room-id=44322889;r9k=0;slow=0 :tmi.twitch.tv ROOMSTATE #chatrooms:44322889:04e762ec-ce8f-4cbc-b6a3-ffc871ab53da': {
        tags: { emoteOnly: 0, roomId: 44322889, r9k: 0, slow: 0 },
        prefix: { full: 'tmi.twitch.tv', host: 'tmi.twitch.tv', user: null },
        command: 'ROOMSTATE',
        params: ['#chatrooms:44322889:04e762ec-ce8f-4cbc-b6a3-ffc871ab53da']
    },
    '@room-id=44322889;slow=10 :tmi.twitch.tv ROOMSTATE #chatrooms:44322889:04e762ec-ce8f-4cbc-b6a3-ffc871ab53da': {
        tags: { roomId: 44322889, slow: 10 },
        prefix: { full: 'tmi.twitch.tv', host: 'tmi.twitch.tv', user: null },
        command: 'ROOMSTATE',
        params: ['#chatrooms:44322889:04e762ec-ce8f-4cbc-b6a3-ffc871ab53da']
    },
    ':tmi.twitch.tv USERSTATE #chatrooms:44322889:04e762ec-ce8f-4cbc-b6a3-ffc871ab53da': {
        tags: {},
        prefix: { full: 'tmi.twitch.tv', host: 'tmi.twitch.tv', user: null },
        command: 'USERSTATE',
        params: ['#chatrooms:44322889:04e762ec-ce8f-4cbc-b6a3-ffc871ab53da']
    },
    '@badges=staff/1;color=#0D4200;display-name=dallas;emote-sets=0,33,50,237,793,2126,3517,4578,5569,9400,10337,12239;turbo=0;user-id=1337;user-type=admin :tmi.twitch.tv GLOBALUSERSTATE': {
        tags: {
            badges: 'staff/1',
            color: '#0D4200',
            displayName: 'dallas',
            emoteSets: '0,33,50,237,793,2126,3517,4578,5569,9400,10337,12239',
            turbo: 0,
            userId: 1337,
            userType: 'admin'
        },
        prefix: { full: 'tmi.twitch.tv', host: 'tmi.twitch.tv', user: null },
        command: 'GLOBALUSERSTATE',
        params: []
    },
    '@badges=global_mod/1,turbo/1;color=#0D4200;display-name=dallas;emotes=25:0-4,12-16/1902:6-10;id=b34ccfc7-4977-403a-8a94-33c6bac34fb8;mod=0;room-id=1337;subscriber=0;tmi-sent-ts=1507246572675;turbo=1;user-id=1337;user-type=global_mod :ronni!ronni@ronni.tmi.twitch.tv PRIVMSG #dallas :Kappa Keepo Kappa': {
        tags: {
            badges: 'global_mod/1,turbo/1',
            color: '#0D4200',
            displayName: 'dallas',
            emotes: '25:0-4,12-16/1902:6-10',
            id: 'b34ccfc7-4977-403a-8a94-33c6bac34fb8',
            mod: 0,
            roomId: 1337,
            subscriber: 0,
            tmiSentTs: 1507246572675,
            turbo: 1,
            userId: 1337,
            userType: 'global_mod'
        },
        prefix: { full: 'ronni!ronni@ronni.tmi.twitch.tv', host: 'ronni.tmi.twitch.tv', user: 'ronni' },
        command: 'PRIVMSG',
        params: ['#dallas', 'Kappa Keepo Kappa']
    },
    '@badges=staff/1,bits/1000;bits=100;color=;display-name=dallas;emotes=;id=b34ccfc7-4977-403a-8a94-33c6bac34fb8;mod=0;room-id=1337;subscriber=0;tmi-sent-ts=1507246572675;turbo=1;user-id=1337;user-type=staff :ronni!ronni@ronni.tmi.twitch.tv PRIVMSG #dallas :cheer100': {
        tags: {
            badges: 'staff/1,bits/1000',
            bits: 100,
            color: null,
            displayName: 'dallas',
            emotes: null,
            id: 'b34ccfc7-4977-403a-8a94-33c6bac34fb8',
            mod: 0,
            roomId: 1337,
            subscriber: 0,
            tmiSentTs: 1507246572675,
            turbo: 1,
            userId: 1337,
            userType: 'staff'
        },
        prefix: { full: 'ronni!ronni@ronni.tmi.twitch.tv', host: 'ronni.tmi.twitch.tv', user: 'ronni' },
        command: 'PRIVMSG',
        params: ['#dallas', 'cheer100']
    },
    '@badges=staff/1,broadcaster/1,turbo/1;color=#008000;display-name=ronni;emotes=;id=db25007f-7a18-43eb-9379-80131e44d633;login=ronni;mod=0;msg-id=resub;msg-param-months=6;msg-param-sub-plan=Prime;msg-param-sub-plan-name=Prime;room-id=1337;subscriber=1;system-msg=ronni\\shas\\ssubscribed\\sfor\\s6\\smonths!;tmi-sent-ts=1507246572675;turbo=1;user-id=1337;user-type=staff :tmi.twitch.tv USERNOTICE #dallas :Great stream -- keep it up!': {
        tags: {
            badges: 'staff/1,broadcaster/1,turbo/1',
            color: '#008000',
            displayName: 'ronni',
            emotes: null,
            id: 'db25007f-7a18-43eb-9379-80131e44d633',
            login: 'ronni',
            mod: 0,
            msgId: 'resub',
            msgParamMonths: 6,
            msgParamSubPlan: 'Prime',
            msgParamSubPlanName: 'Prime',
            roomId: 1337,
            subscriber: 1,
            systemMsg: 'ronni has subscribed for 6 months!',
            tmiSentTs: 1507246572675,
            turbo: 1,
            userId: 1337,
            userType: 'staff'
        },
        prefix: { full: 'tmi.twitch.tv', host: 'tmi.twitch.tv', user: null },
        command: 'USERNOTICE',
        params: ['#dallas', 'Great stream -- keep it up!']
    },
    '@badges=staff/1,premium/1;color=#0000FF;display-name=TWW2;emotes=;id=e9176cd8-5e22-4684-ad40-ce53c2561c5e;login=tww2;mod=0;msg-id=subgift;msg-param-months=1;msg-param-recipient-display-name=Mr_Woodchuck;msg-param-recipient-id=89614178;msg-param-recipient-name=mr_woodchuck;msg-param-sub-plan-name=House\\sof\\sNyoro~n;msg-param-sub-plan=1000;room-id=19571752;subscriber=0;system-msg=TWW2\\sgifted\\sa\\sTier\\s1\\ssub\\sto\\sMr_Woodchuck!;tmi-sent-ts=1521159445153;turbo=0;user-id=13405587;user-type=staff :tmi.twitch.tv USERNOTICE #forstycup': {
        tags: {
            badges: 'staff/1,premium/1',
            color: '#0000FF',
            displayName: 'TWW2',
            emotes: null,
            id: 'e9176cd8-5e22-4684-ad40-ce53c2561c5e',
            login: 'tww2',
            mod: 0,
            msgId: 'subgift',
            msgParamMonths: 1,
            msgParamRecipientDisplayName: 'Mr_Woodchuck',
            msgParamRecipientId: 89614178,
            msgParamRecipientName: 'mr_woodchuck',
            msgParamSubPlanName: 'House of Nyoro~n',
            msgParamSubPlan: 1000,
            roomId: 19571752,
            subscriber: 0,
            systemMsg: 'TWW2 gifted a Tier 1 sub to Mr_Woodchuck!',
            tmiSentTs: 1521159445153,
            turbo: 0,
            userId: 13405587,
            userType: 'staff'
        },
        prefix: { full: 'tmi.twitch.tv', host: 'tmi.twitch.tv', user: null },
        command: 'USERNOTICE',
        params: ['#forstycup']
    },
    '@badges=turbo/1;color=#9ACD32;display-name=TestChannel;emotes=;id=3d830f12-795c-447d-af3c-ea05e40fbddb;login=testchannel;mod=0;msg-id=raid;msg-param-displayName=TestChannel;msg-param-login=testchannel;msg-param-viewerCount=15;room-id=56379257;subscriber=0;system-msg=15\\sraiders\\sfrom\\sTestChannel\\shave\\sjoined\\n!;tmi-sent-ts=1507246572675;tmi-sent-ts=1507246572675;turbo=1;user-id=123456;user-type= :tmi.twitch.tv USERNOTICE #othertestchannel': {
        tags: {
            badges: 'turbo/1',
            color: '#9ACD32',
            displayName: 'TestChannel',
            emotes: null,
            id: '3d830f12-795c-447d-af3c-ea05e40fbddb',
            login: 'testchannel',
            mod: 0,
            msgId: 'raid',
            msgParamDisplayName: 'TestChannel',
            msgParamLogin: 'testchannel',
            msgParamViewerCount: 15,
            roomId: 56379257,
            subscriber: 0,
            systemMsg: '15 raiders from TestChannel have joined!',
            tmiSentTs: 1507246572675,
            turbo: 1,
            userId: 123456,
            userType: null
        },
        prefix: { full: 'tmi.twitch.tv', host: 'tmi.twitch.tv', user: null },
        command: 'USERNOTICE',
        params: ['#othertestchannel']
    },
    '@badges=;color=;display-name=SevenTest1;emotes=30259:0-6;id=37feed0f-b9c7-4c3a-b475-21c6c6d21c3d;login=seventest1;mod=0;msg-id=ritual;msg-param-ritual-name=new_chatter;room-id=6316121;subscriber=0;system-msg=Seventoes\\sis\\snew\\shere!;tmi-sent-ts=1508363903826;turbo=0;user-id=131260580;user-type= :tmi.twitch.tv USERNOTICE #seventoes :HeyGuys': {
        tags: {
            badges: null,
            color: null,
            displayName: 'SevenTest1',
            emotes: '30259:0-6',
            id: '37feed0f-b9c7-4c3a-b475-21c6c6d21c3d',
            login: 'seventest1',
            mod: 0,
            msgId: 'ritual',
            msgParamRitualName: 'new_chatter',
            roomId: 6316121,
            subscriber: 0,
            systemMsg: 'Seventoes is new here!',
            tmiSentTs: 1508363903826,
            turbo: 0,
            userId: 131260580,
            userType: null
        },
        prefix: { full: 'tmi.twitch.tv', host: 'tmi.twitch.tv', user: null },
        command: 'USERNOTICE',
        params: ['#seventoes', 'HeyGuys']
    }
};

for (const raw of Object.keys(EXAMPLES)) {
    test(raw, function () {
        const expected = Object.assign({ raw, inferred: {} }, EXAMPLES[raw]);
        expect(parseMsg(raw)).toEqual(expected);
    });
}
