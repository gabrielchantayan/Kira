const Discord = require('discord.js');      // Import Discord
var config = require('../config.json');     // Import config
var utils = require('../utils.js');         // Import utilities

var waifus = require('../data/fun/waifus.json');            // Import waifus
var slaps = require('../data/fun/slap.json');               // Import slaps
var floridaman = require('../data/fun/floridaman.json');    // Import floridaman
const pastas = require('../data/fun/pastas.json');          // Copypastas
var standNames = require('../data/fun/stands.json');        // Stand Names

function subOrDom(sub) {
    // Descriptions
    if (sub <= 1) { return 'Hard Sub'; }
    if (sub > 1 && sub <= 3.5) { return 'Sub'; }
    if (sub > 3.5 && sub <= 4) { return 'Sub-leaning Switch'; }
    if (sub > 4 && sub <= 5) { return 'Switch'; }
    if (sub > 5 && sub <= 5.5) { return 'Dom-Leaning Switch'; }
    if (sub > 5.5 && sub <= 8) { return 'Dom'; }
    if (sub > 8) { return 'Hard Dom'; }
}

var standAppearances = ['Natural Humanoid', 'Artificial Humanoid', 'Natural Non-Humanoid', 'Artificial Non-Humanoid', 'Phenomenon'];
var standAbilities = ['Close-Range Power Type', 'Long-Distance Operation Type', 'Automatic Type', 'Range Irrelevant'];
var standGrades = ['A', 'B', 'C', 'D', 'E'];

module.exports = {
    module: {
        name: 'Fun',
        description: 'Fun commands',
        version: '1.1.0',
        source: 'https://raw.githubusercontent.com/gabrielchantayan/Kira/master/modules/fun.js',
        authors: ['Gab#2302']
    },

    commands: {
        waifu: {
            name: 'waifu',
            help: 'Get stats about your waifu',
            syntax: 'waifu {waifu}',
            main: function (message, args) {
                // Check if no waifu
                if (args.length == 0) {
                    message.reply('please enter a waifu to rate');
                }

                // See if predetermined waifu rating
                else if (args.join(' ').toLowerCase() in waifus) {
                    message.reply(`${args.join(' ')} is rated ${waifus[args.join(' ').toLowerCase()]}/10`)
                }

                // Sum of chars
                else {
                    message.reply(`${args.join(' ')} is rated ${utils.seededRandom(args.join(' ').toLowerCase(), places=1, shift=1)}/10`)
                }
            }
        },

        slap: {
            name: 'slap',
            help: 'Slap someone',
            syntax: 'slap {user}',
            main: function (message, args) {
                // If they didnt specify a user
                if (args.length == 0 || message.mentions.users.first() == null) {
                    message.channel.send(`${message.author} swings their arms in the air... and hits nothing. Go figure.`);
                }

                // If they did slap a user
                else {
                    var person = message.mentions.users.first();

                    if (person.id == message.client.user.id) {
                        message.channel.send('How about you go fuck yourself?');
                    } else {
                        message.channel.send(`${message.author} slaps ${person} with ${slaps[Math.floor(Math.random() * slaps.length)]}`);
                    }
                }
            }
        },

        penis: {
            name: 'penis',
            help: 'How hung are you?',
            syntax: 'penis {user}',
            main: function (message, args) {
                var person = message.mentions.users.first();
                var dickSize = 1;
                // Check if no waifu
                if (args.length == 0 || message.mentions.users.first() == null) {
                    person = message.author;
                }
                switch (person.id) {
                    case message.client.user.id:
                        dickSize = 16.7;
                        break;
                    case '172137993665118208':
                        dickSize = 16.9;
                        break;
                    case '430223904028622848':
                        dickSize = 0.2;
                        break;
                    default:
                        dickSize = utils.seededRandom(person.id, places=1, shift=1, outOf=15);
                        break;
                }
                
                message.channel.send(`${person}'s penis is ${dickSize} inches long\n8${'='.repeat(Math.floor(dickSize*1.75))}D`);
            }
        },

        lovecalculator: {
            name: 'lovecalculator',
            help: 'How in love are they?',
            syntax: 'lovecalculator {user} {user}',
            aliases: ['shiporskip', 'ship', 'love'],
            main: function (message, args) {
                var person1 = message.mentions.users.first();
                var person2 = message.mentions.users.array()[1];

                // Check if no waifu
                if (args.length == 0 || person1 == null || person2 == null) {
                    message.reply('please enter two users to calculate')
                }
                

                var love = 0;
                if (parseInt(person1.id) >= parseInt(person2.id)) {
                    love = utils.seededRandom(`${person1.id}${person2.id}`, places = 1, shift = 2);
                } else {
                    love = utils.seededRandom(`${person2.id}${person1.id}`, places = 1, shift = 2);
                }
                

                message.channel.send(`Calculating love...`);
                setTimeout(function(){
                    msg = `${person1} and ${person2} have a compatability rating of **${love}%**`
                    if (love <= 33) msg += '\nBetter luck next time...';
                    else if (love > 33 && love <= 50) msg += '\nMaybe you guys should just be friends';
                    else if (love > 50 && love <= 70) msg += '\nYou guys seem to be hitting it off';
                    else if (love > 70 && love <= 85) msg += '!\nYou two have really great chemistry!';
                    else if (love > 85 && love <= 95) msg += '!!\nJust marry each other already';
                    else if (love > 95) msg += '!!!\nYou two must be soulmates!';

                    message.channel.send(msg)
                },1250)
            }
        },

        hotcrazy: {
            name: 'hotcrazy',
            help: 'Rate someone on the hot-crazy scale',
            syntax: 'hotcrazy {user}',
            aliases: ['rate'],
            main: function (message, args) {
                var person = message.mentions.users.first();

                // Check if no waifu
                if (args.length == 0 || message.mentions.users.first() == null) {
                    person = message.author;
                }
                
                // Init hot-crazy
                var hot = 0;
                var crazy = 0;
                var desc = '';

                // Hard-coded values
                switch (person.id){
                    // KiraMiki
                    case message.client.user.id:
                        hot = 10;
                        crazy = 4;
                        break;
                    
                    // Gab
                    // case '172137993665118208':
                    //     hot = 10;
                    //     crazy = 4;
                    //     break;

                    // Default
                    default:
                        hot = utils.seededRandom(`${person.id}${person.id}`, places = 2, shift = 1);
                        crazy = utils.seededRandom(`${hot}${person.id}${hot}`, places = 2, shift = 1, outOf=6) + 4;
                        break;
                }

                // Descriptions
                if (hot <= 5) { desc = 'This is the **No-Go Zone**. Girls below a 5 in hotness are not worth it, at all.'; }
                else if (hot > 5 && hot <= 8){
                    if (hot + 2 >= crazy) {
                        desc = 'This is the **Fun Zone**. While people in this zone are enjoyable and the life of the party, you should try to move to a more permanent zone.';
                    }
                    else {
                        desc = 'This is the **Danger Zone**. This zone is reserved for Redheads, Strippers, Girls named Tiffany, ect.'
                    }
                }
                else if (hot > 8) {
                    if (crazy <= 5){ desc = 'This is the **Unicorn Zone**. People like this don\'t exist.'; }
                    else if (crazy > 5 && crazy <= 7) { desc = 'This is the **Wife Zone**. If a girl is in this zone, wife her already!'; }
                    else if (crazy > 7 && hot + .5 >= crazy) { desc = 'This is the **Date Zone**. Someone in this zone is great to date, but you should get them into the Wife Zone quick'}
                    else {
                        desc = 'This is the **Danger Zone**. This zone is reserved for Redheads, Strippers, Girls named Tiffany, ect.'
                    }
                }
                else {
                    desc = 'This is the **Danger Zone**. This zone is reserved for Redheads, Strippers, Girls named Tiffany, ect.'
                }

                

                // Build embed
                var embed = utils.buildEmbed({
                    'title': `Hot-Crazy rating for ${message.guild.member(person).displayName}`,
                    'thumbnail': `${person.displayAvatarURL()}`,
                    'fields': [
                        ['Hot', hot, true],
                        ['Crazy', crazy, true],
                        ['Zone', desc]
                    ]
                });

                message.channel.send({embed});
            }
        },

        iq: {
            name: 'iq',
            help: 'How smart are you?',
            syntax: 'iq {user}',
            main: function (message, args) {
                var person = message.mentions.users.first();
                // Check if no waifu

                var iq = 0;
                if (args.length == 0 || message.mentions.users.first() == null) {
                    person = message.author;
                }

                // Hard Coded
                switch (person.id){
                    case message.client.user.id:
                        iq = 301;
                        break;
                    case '172137993665118208':
                        iq = 168;
                        break;
                    case '430223904028622848':
                        iq = 4;
                        break;
                    case '416684102683459594':
                        iq = -16
                        break;
                    default:
                        iq = utils.seededRandom(parseInt(person.id)*5, places = 0, shift = 1, outOf=120) + 60;
                        break;
                }

                try {
                    message.channel.send('🐵 Intercepting brain waves...').then((msg) => {
                        setTimeout(function(){ msg.edit('🙈 Making monkey noises...');}, 750);
                        setTimeout(function(){ msg.edit('🙉 Running tests...');}, 1500);
                        setTimeout(function(){ msg.edit('🙊 Interpretting data...');}, 2250);
                        setTimeout(function(){ msg.edit(`${person}'s IQ is ${iq}`)}, 3000)
                    });
                }
                catch {
                    message.channel.send(`${person}'s IQ is ${iq}`);
                }
                

                // message.channel.send('🐵 Intercepting brain waves...').then((msg) => {
                //     setTimeout(function(){ msg.edit('🙈 Making monkey noises...');}, 750) }).then((msg) => {
                //     setTimeout(function(){ msg.edit('🙉 Running tests...');}, 750)}).then((msg) => {
                //     setTimeout(function(){ msg.edit('🙊 Interpretting data...');}, 750)}).then((msg) => {
                //     setTimeout(function(){ msg.edit(`${person}'s IQ is ${iq}`)}, 1000)
                // });
            }
        },

        floridaman: {
            name: 'floridaman',
            help: 'Get a random Florida Man fact',
            syntax: 'floridaman',
            main: function (message, args) {
                
                message.channel.send(floridaman[Math.floor(Math.random()*floridaman.length)]);

            }
        },

        ratetoes: {
            name: 'ratetoes',
            help: 'Rate someone\'s toes 👀👀',
            syntax: 'ratetoes {user}',
            aliases: ['toes'],
            main: function (message, args) {
                var person = message.mentions.users.first();

                // Check if no waifu
                if (args.length == 0 || message.mentions.users.first() == null) {
                    person = message.author;
                }

                // Init hot-crazy
                var exq = 0;
                var desc = '';

                // Hard-coded values
                switch (person.id) {
                    // KiraMiki
                    case message.client.user.id:
                        exq = 10;
                        break;

                    // Gab
                    case '172137993665118208':
                        exq = 10;
                        break;

                    // Kate
                    case '710141353987670036':
                        exq = 11.9;
                        break;

                    // Anna
                    case '430223904028622848':
                        exq = 0.1;
                        break;

                    // Default
                    default:
                        exq = utils.seededRandom(`${person.id}toes${person.id}`, places = 2, shift = 1);
                        break;
                }

                // Descriptions
                if (exq <= 1) { desc = 'Disgusting. Horrendous. I want to throw up, but alas I am just a Discord Bot. Never send toes in your life. Please.'; }
                if (exq > 1 && exq <= 2.5) { desc = 'Your toes are atrocious. Never send toes in your life. Please.'; }
                if (exq > 2.5 && exq <= 4) { desc = 'You have subpar toes. I could get better toes on WikiFeet'; }
                if (exq > 4 && exq <= 6) { desc = 'Your toes are mediocre.'; }
                if (exq > 6 && exq <= 7.5) { desc = 'Your toes are pretty nice, but they could use some work'; }
                if (exq > 7.5 && exq <= 8.5) { desc = 'Yo, nice toes! Really beautiful feet you got there! Definitely should send toe pics.'; }
                if (exq > 8.5 && exq <= 9.25) { desc = 'Wow those are some amazing toes! Holy shit! Nice! Definitely should send toe pics.'; }
                if (exq > 9.25 && exq <= 10) { desc = 'Those are some top tier toes you have there! Definitely should send toe pics.'; }
                if (exq > 10) { desc = '* \*jaw drops to the floor\* * **AWOOGA!!** Nice toes! Some of the best pinkies ive ever seen. You should definitely send toe pics 👀👀'; }



                // Build embed
                var embed = utils.buildEmbed({
                    'title': `Toe rating for ${message.guild.member(person).displayName}`,
                    'thumbnail': `${person.displayAvatarURL()}`,
                    'fields': [
                        ['Exquisiteness', exq, true],
                        ['Toe analysis report', desc]
                    ]
                });

                message.channel.send({ embed });
            }
        },
        
        subordom: {
            name: 'subordom',
            help: 'Are you a sub or a dom?',
            syntax: 'subordom {user}',
            aliases: ['sub', 'dom', 'switch'],
            main: function (message, args) {
                var person = message.mentions.users.first();

                // Check if no waifu
                if (args.length == 0 || message.mentions.users.first() == null) {
                    person = message.author;
                }

                // Init hot-crazy
                var sub = 0;
                var desc = '';

                // Hard-coded values
                switch (person.id) {
                    // KiraMiki
                    case message.client.user.id:
                        sub = 10;
                        break;

                    // Gab
                    case '172137993665118208':
                        sub = 9.5;
                        break;

                    // Kate
                    case '710141353987670036':
                        sub = 0;
                        break;

                    // Default
                    default:
                        sub = utils.seededRandom(`${person.id}subordom`, places = 2, shift = 1, outOf=9);
                        break;
                }

                // Descriptions
                desc = subOrDom(sub);

                var chart = ' '.repeat(Math.floor(sub * (12/9)))

                // Build embed
                var embed = utils.buildEmbed({
                    'title': `Sub-Dom analysis for ${message.guild.member(person).displayName}`,
                    'thumbnail': `${person.displayAvatarURL()}`,
                    'fields': [
                        ['Sub-Dom Rating', sub, true],
                        ['Description', desc],
                        ['Chart', `\`<============>\`\n\`${chart}^\``]
                    ]
                });

                message.channel.send({ embed });
            }
        },
        
        compatibility: {
            name: 'compatibility',
            help: 'A full-blown compatibility suite, involving subordom, lovecalculator, penis, and more',
            syntax: 'compatibility {user} {user}',
            main: function (message, args) {
                // Persons
                var person1 = message.mentions.users.first();
                var person2 = message.mentions.users.array()[1];

                // Display names
                var disp1 = message.guild.member(person1).displayName
                var disp2 = message.guild.member(person2).displayName

                // Variables calculated
                var love = 0; // exq
                var penis1, penis2;         // Penis sizes
                var sub1, sub2;             // Sub or Dom ratings
                var subD1, subD2;           // Sub or Dom descriptions
                var hotCrazy1, hotCrazy2;   // Hot crazy ratings


                // Check if no waifu
                if (args.length == 0 || person1 == null || person2 == null) {
                    message.reply('please enter two users to calculate')
                }
                
                // love
                if (parseInt(person1.id) >= parseInt(person2.id)) {
                    love = utils.seededRandom(`${person1.id}${person2.id}`, places = 1, shift = 2);
                } else {
                    love = utils.seededRandom(`${person2.id}${person1.id}`, places = 1, shift = 2);
                }

                // Dick sizes
                switch (person1.id) {
                    case message.client.user.id:
                        penis1 = 16.7;
                        break;
                    case '172137993665118208':
                        penis1 = 16.9;
                        break;
                    default:
                        penis1 = utils.seededRandom(person1.id, places = 1, shift = 1, outOf = 15);
                        break;
                }
                switch (person2.id) {
                    case message.client.user.id:
                        penis2 = 16.7;
                        break;
                    case '172137993665118208':
                        penis2 = 16.9;
                        break;
                    default:
                        penis2 = utils.seededRandom(person2.id, places = 1, shift = 1, outOf = 15);
                        break;
                }

                var dickDiff = parseFloat(Math.abs(penis1 - penis2).toFixed(1));

                // Sub or Dom
                switch (person1.id) {
                    // KiraMiki
                    case message.client.user.id:
                        sub1 = 10;
                        break;

                    // Gab
                    case '172137993665118208':
                        sub1 = 9.5;
                        break;

                    // Kate
                    case '710141353987670036':
                        sub1 = 0;
                        break;

                    // Default
                    default:
                        sub1 = utils.seededRandom(`${person1.id}subordom`, places = 2, shift = 1, outOf=9);
                        break;
                }
                switch (person2.id) {
                    // KiraMiki
                    case message.client.user.id:
                        sub2 = 10;
                        break;

                        // Gab
                    case '172137993665118208':
                        sub2 = 9.5;
                        break;

                        // Kate
                    case '710141353987670036':
                        sub2 = 0;
                        break;

                        // Default
                    default:
                        sub2 = utils.seededRandom(`${person2.id}subordom`, places = 2, shift = 1, outOf = 9);
                        break;
                }

                var subDomDiff = parseFloat(Math.abs(sub1 - sub2).toFixed(1));
                subD1 = subOrDom(sub1);
                subD2 = subOrDom(sub2);

                // Hot-Crazy Matrix
                switch (person1.id){
                    // KiraMiki
                    case message.client.user.id:
                        hotCrazy1 = [10,4]
                    // Default
                    default:
                        let hot = utils.seededRandom(`${person1.id}${person1.id}`, places = 2, shift = 1)
                        hotCrazy1 = [hot,
                                     utils.seededRandom(`${hot}${person1.id}${hot}`, places = 2, shift = 1, outOf=6) + 4]
                        break;
                }
                switch (person2.id){
                    // KiraMiki
                    case message.client.user.id:
                        hotCrazy2 = [10,4]
                    // Default
                    default:
                        let hot = utils.seededRandom(`${person2.id}${person2.id}`, places = 2, shift = 1)
                        hotCrazy2 = [hot,
                                     utils.seededRandom(`${hot}${person2.id}${hot}`, places = 2, shift = 1, outOf=6) + 4]
                        break;
                }

                var hotDiff = parseFloat(Math.abs(hotCrazy1[0] - hotCrazy2[0]).toFixed(1));
                var crazyDiff = parseFloat(Math.abs(hotCrazy1[1] - hotCrazy2[1]).toFixed(1));

                // Calculate compatability
                var compatibility = parseFloat(100 - (100 -
                    (((9 - subDomDiff) / 9) * 33) - 
                    (((10 - hotDiff) / 10) * 33) -
                    (((10 - crazyDiff) / 10) * 33)).toFixed(2));
                
                var embed = utils.buildEmbed({
                    'title': `Compatibility Matrix for ${disp1} and ${disp2}`,
                    'fields': [
                        ['Love compatibility', `${love}%`],
                        [`${disp1}'s penis size`, `${penis1} inches`, true],
                        [`${disp2}'s penis size`, `${penis2} inches`, true],
                        ['Difference in penis sizes', `${dickDiff} inches`],
                        [`${disp1}'s Sub or Dom rating`, `${sub1}`],
                        [`${disp1}'s Sub or Dom category`, `${subD1}`],
                        [`${disp2}'s Sub or Dom rating`, `${sub2}`],
                        [`${disp2}'s Sub or Dom category`, `${subD2}`],
                        ['Difference in sub-dom scale', `${subDomDiff}`],
                        [`${disp1}'s Hot-Crazy rating`, `${hotCrazy1[0]}-${hotCrazy1[1]}`, true],
                        [`${disp2}'s Hot-Crazy rating`, `${hotCrazy2[0]}-${hotCrazy2[1]}`, true],
                        ['Difference in hotness', `${hotDiff}`],
                        ['Difference in craziness', `${crazyDiff}`],
                        ['Total Compatibility', `${compatibility}%`],
                    ]
                })

                message.channel.send({embed});
                
            }
        },

        bdsm: {
            name: 'bdsm',
            help: 'BDSM results',
            syntax: 'bdsm {user}',
            main: function (message, args) {
                categories = 
                ['Vanilla',
                'Switch',
                'Dominant',
                'Master / Mistress',
                'Daddy / Mommy',
                'Brat tamer',
                'Experimentalist',
                'Submissive',
                'Slave',
                'Non - monogamist',
                'Primal(Hunter)',
                'Voyeur',
                'Pet',
                'Primal(Prey)',
                'Rigger',
                'Exhibitionist',
                'Brat',
                'Owner',
                'Rope bunny',
                'Ageplayer',
                'Degradee',
                'Boy / Girl',
                'Masochist',
                'Degrader',
                'Sadist'];

                var person = message.mentions.users.first();
                // Check if no waifu
                if (args.length == 0 || message.mentions.users.first() == null) {
                    person = message.author;
                }

                var results = [];

                for (cat in categories) {
                    results.push([categories[cat], utils.seededRandom(`${person.id}${categories[cat]}`, places = 0, shift = 2)]);
                }

                // var sortable = [];
                // for (var cat in results) {
                //     sortable.push([cat, results[vehicle]]);
                // }

                results.sort(function (a, b) {
                    return b[1] - a[1];
                });

                resultStr = '';
                
                for (result in results){
                    resultStr += `\n ${results[result][1]}% ${results[result][0]}`
                }

                // Reply with pong
                message.channel.send(`**BDSM Results for ${person}**${resultStr}`);
            }
        },

        copypasta: {
            name: 'copypasta',
            help: 'Says a random copypasta',
            syntax: 'copypasta',
            aliases: ['pasta'],
            main: function (message, args) {
                message.channel.send(pastas[Math.floor(Math.random() * pastas.length)], {'split': true});
            }
        },

        furry: {
            name: 'furry',
            help: 'Is [user] a furry?',
            syntax: 'furry {user}',
            main: function (message, args) {
                var person = message.mentions.users.first();

                // Check if no waifu
                if (args.length == 0 || message.mentions.users.first() == null) {
                    person = message.author;
                }

                // Init hot-crazy
                var exq = 0;
                var msg = '';

                // Hard-coded values
                switch (person.id) {
                    // KiraMiki
                    case message.client.user.id:
                        exq = 0;
                        break;

                        // Gab
                    case '172137993665118208':
                        exq = 0;
                        break;

                        // Isa
                    case '694000102863405148':
                        exq = 100;
                        break;

                        // Anna
                    case 'Elena':
                        exq = 97.5;
                        break;

                        // Default
                    default:
                        exq = utils.seededRandom(`${person.id}furry`, places = 1, shift = 2);
                        break;
                }

                msg = `${person} is ${exq}% a furry.`

                // Descriptions
                if (exq <= 33) msg += '\nGood that they have no furry tendencies.';
                else if (exq > 33 && exq <= 50) msg += '\nWe should watch out for them...';
                else if (exq > 50 && exq <= 60) msg += '\n"I appreciate anthromorphic designs and characters" my ass';
                else if (exq > 60 && exq <= 70) msg += '\nI think I saw furry porn in their search history';
                else if (exq > 70 && exq <= 85) msg += '\nI think I saw fursuits in their Amazon shopping cart';
                else if (exq > 85 && exq <= 95) msg += '\nThat\'s way too high of a number and that is not ok. Definitely a furry';
                else if (exq > 95) msg += `\nWe need to exterminate ${person}. Now.`;


                message.channel.send(msg);
            }
        },

        stand: {
            name: 'stand',
            help: 'What is your stand?',
            syntax: 'stand {user}',
            main: function (message, args) {
                var person = message.mentions.users.first();
                // Check if no waifu
                if (args.length == 0 || message.mentions.users.first() == null) {
                    person = message.author;
                }

                // 「」
                
                var standName = standNames[utils.seededRandom(`${person.id}standName`, places = 0, shift = 0, outOf = standNames.length - 1)];
                var standAppearence = standAppearances[utils.seededRandom(`${person.id}standAppearence`, places = 0, shift = 1, outOf = standAppearances.length - 1)];
                var standAbility = standAbilities[utils.seededRandom(`${person.id}standAbilities`, places = 0, shift = 1, outOf = standAbilities.length - 1)];

                var dst = standGrades[utils.seededRandom(`${person.id}destruction`, places = 0, shift = 1, outOf = standGrades.length - 1)];
                var spd = standGrades[utils.seededRandom(`${person.id}speed`, places = 0, shift = 1, outOf = standGrades.length - 1)];
                var rng = standGrades[utils.seededRandom(`${person.id}range`, places = 0, shift = 1, outOf = standGrades.length - 1)];
                var per = standGrades[utils.seededRandom(`${person.id}persistance`, places = 0, shift = 1, outOf = standGrades.length - 1)];
                var pre = standGrades[utils.seededRandom(`${person.id}precision`, places = 0, shift = 1, outOf = standGrades.length - 1)];
                var dev = standGrades[utils.seededRandom(`${person.id}development potential`, places = 0, shift = 1, outOf = standGrades.length - 1)];

                var embed = utils.buildEmbed({
                    'title': `STAND NAME 「${standName}」`,
                    'description': `STAND MASTER 「${message.guild.member(person).displayName}」`,
                    'thumbnail': `${person.displayAvatarURL()}`,
                    'fields': [
                        ['Stand type', `${standAbility} ${standAppearence}`],
                        ['Destructive Power', dst, true],
                        ['Speed', spd, true],
                        ['Range', rng, true],
                        ['Persistence', per, true],
                        ['Precision', pre, true],
                        ['Development Potential', dev, true]
                    ]
                });

                message.channel.send({embed});
            }
        },

//         cowsay: {
//             name: 'cowsay',
//             help: 'Speak, cow!',
//             syntax: 'cowsay [words]',
//             main: function (message, args) {
//                 /*
// wow! da cow!
//  __________________
// < srsly dude, why? >
//  ------------------
//         \   ^__^
//          \  (oo)\_______
//             (__)\       )\/\
//                 ||----w |
//                 ||     |

//                 */
//                 // Check if no waifu
//                 if (args.length == 0) {
//                     msg = 'd'
//                 }

//                 // See if predetermined waifu rating
//                 else if (args.join(' ').toLowerCase() in waifus) {
//                     message.reply(`${args.join(' ')} is rated ${waifus[args.join(' ').toLowerCase()]}/10`)
//                 }

//                 // Sum of chars
//                 else {
//                     message.reply(`${args.join(' ')} is rated ${utils.seededRandom(args.join(' ').toLowerCase(), places=1, shift=1)}/10`)
//                 }
//             }
//         },



    }
}