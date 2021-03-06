const Discord = require('discord.js');      // Import Discord
var config = require('../config.json');     // Import config
var utils = require('../utils.js')          // Import utilities

var profiles = require('../data/profiles/profiles.json')    // Import profiles

var aspects = ['name', 'gender', 'pronouns', 'color', 'country', 'region', 'occupation', 'languages', 'likes', 'dislikes', 'favshow', 'favmovie', 'socials'];

var defaultColors = ['c03221', 'ba5a31', '2c423f', 'd4e4bc', '96abc7', '730513', '4e6b67', '56fcef', '07f0c5', '055f63', '327da8', '064894', '1f7d77', '313638', 'E8E9EB',
    'E4B363', '6EA4BF', '41337A', '750D37', '3D314A', 'E6FDFF'];

module.exports = {
    module: {
        name: 'Profiles',
        description: 'User profiles',
        version: '1.1.4',
        source: 'https://raw.githubusercontent.com/gabrielchantayan/Kira/master/modules/profile.js',
        authors: ['Gab#2302']
    },

    commands: {
        profile: {
            name: 'profile',
            help: 'Bring up a user\'s profile',
            syntax: 'profile [user]',
            main: function (message, args) {
                // Set target
                var person = message.mentions.users.first();
                // Check if no waifu
                
                if (args.length == 0 || message.mentions.users.first() == null) {
                    person = message.author;
                }

                // Check if profile exists in file
                if (person.id in profiles) {

                    // Condense code
                    function checkForAndPush(field, inline = false, name = utils.capitalize(field)) {
                        if (profiles[person.id].hasOwnProperty(field)) {
                            dataForEmbed.fields.push([name, profiles[person.id][field], inline]);
                        }
                    }

                    // Create data for embed
                    var dataForEmbed = {
                        'title': `${person.username}'s profile`,
                        'thumbnail': `${person.avatarURL()}`,
                        'fields': []
                    };

                    // Set color
                    if (profiles[person.id].hasOwnProperty('color')) dataForEmbed.color = `#${profiles[person.id]['color']}`

                    // Add default fields
                    checkForAndPush('name');
                    checkForAndPush('gender', true);
                    checkForAndPush('pronouns', true);
                    checkForAndPush('occupation');
                    
                    var location = '';
                    if (profiles[person.id].hasOwnProperty('region')) location += profiles[person.id]['region'];
                    if (profiles[person.id].hasOwnProperty('region') && profiles[person.id].hasOwnProperty('country')) location += ', ';
                    if (profiles[person.id].hasOwnProperty('country')) location += profiles[person.id]['country'];

                    if (location != '') dataForEmbed.fields.push(['Location', location]);

                    checkForAndPush('languages');
                    checkForAndPush('likes', true);
                    checkForAndPush('dislikes', true);
                    checkForAndPush('favshow', true, 'Favorite TV Show');
                    checkForAndPush('favmovie', true, 'Favorite Movie');

                    if (profiles[person.id].hasOwnProperty('socials')){
                        var listOfSocials = [];
                        
                        for (social in profiles[person.id]['socials']) {
                            listOfSocials.push(`[${social}](${profiles[person.id]['socials'][social]})`)
                        }
                        dataForEmbed.fields.push(['Socials', `${listOfSocials.join('\n')}`]);
                    }

                    // Custom fields
                    // Used for non-profile modules
                    for (field in profiles[person.id]){
                        // Skip default fields
                        if (aspects.includes(field)) continue;

                        dataForEmbed.fields.push([utils.capitalize(field), profiles[person.id][field]]);
                    }

                    var embed = utils.buildEmbed(dataForEmbed);

                    message.channel.send({embed})

                } else {
                    message.channel.send(`${person} has not created a profile yet. Please use \`${config.prefixes[0]}profileset\` to make a profile`);
                }



            }
        },

        profileset: {
            name: 'profileset',
            help: 'Set an aspect of your profile.',
            syntax: 'profileset {setting} {value}',
            main: function (message, args) {
                
                if (args.length < 2){
                    message.reply(`please use \`${this.syntax}\` to change your profile\n**Available settings:** \`${aspects.join('\`, \`')}\``);
                } else {

                    if (!profiles.hasOwnProperty(message.author.id)){
                        profiles[message.author.id] = {}
                    }

                    // args[0] = args[0].toLowerCase();

                    switch (args[0].toLowerCase()) {
                        // Join args[1]..[n] with space
                        case 'name':
                        case 'occupation':
                        case 'country':
                        case 'region':
                        case 'favshow':
                        case 'favmovie':
                            // Set data
                            profiles[message.author.id][args[0].toLowerCase()] = args.slice(1).join(' ');

                            // Confirm command worked
                            message.channel.send(`Set ${message.author}'s ${args[0].toLowerCase()} to **${args.slice(1).join(' ')}**`);
                            break;

                        // Join args[1]..[n] with slash
                        case 'pronouns':
                            // Set data
                            profiles[message.author.id]['pronouns'] = args.slice(1).join('/');

                            // Confirm command worked
                            message.channel.send(`Set ${message.author}'s pronouns to **${args.slice(1).join('/')}**`);
                            break;

                        // Join args[1]..[n] with comma
                        case 'likes':
                        case 'dislikes':
                        case 'languages':
                            // Set data
                            profiles[message.author.id][args[0].toLowerCase()] = args.slice(1).join(', ');

                            // Confirm command worked
                            message.channel.send(`Set ${message.author}'s ${args[0].toLowerCase()} to **${args.slice(1).join(', ')}**`);
                            break;

                        // Gender
                        case 'gender':
                            // Set data
                            profiles[message.author.id]['gender'] = utils.capitalize(args[1]);

                            // Auto-set pronouns 
                            if (args[1].toLowerCase() == 'male') profiles[message.author.id]['pronouns'] = 'he/him';
                            else if (args[1].toLowerCase() == 'female') profiles[message.author.id]['pronouns'] = 'her/hers';

                            // Confirm command worked
                            message.channel.send(`Set ${message.author}'s gender to **${args[1]}**`);
                            break;

                        // Color
                        case 'color':
                            // Test for valid hex code (sans #)
                            if (/^[0-9A-F]{6}$/i.test(args[1])) {
                                profiles[message.author.id]['color'] = args[1];
                                message.channel.send(`Set ${message.author}'s profile color to **#${args[1]}**`);
                            }
                            else if (args[1].toLowerCase() == 'random'){
                                profiles[message.author.id]['color'] = defaultColors[Math.floor(Math.random() * defaultColors.length)];
                                message.channel.send('I changed your profile color to a random color')
                            }
                            else {
                                profiles[message.author.id]['color'] = defaultColors[Math.floor(Math.random() * defaultColors.length)];
                                message.channel.send('Invalid color code. Please use a correct hex code (i.e `3cdf4e` or `ABB65C`) or `random`\nI changed your profile color to a random color');
                            }
                            break;

                        default:
                            message.reply(`please use \`${this.syntax}\` to change your profile\n**Available settings:** \`${aspects.join('\`, \`')}\``);

                    }

                    // Save data
                    utils.write(profiles, 'profiles', 'profiles')

                }
            }
        },

        removefromprofile: {
            name: 'removefromprofile',
            help: 'Remove a part of your profile',
            syntax: 'removefromprofile {setting}',
            aliases: ['profileremove'],
            main: function (message, args) {

                if (args.length != 1) {
                    message.reply(`please use \`${this.syntax}\` to remove something from your profile\n**Available settings:** \`${aspects.join('\`, \`')}\``);
                } else {

                    if (profiles.hasOwnProperty(message.author.id)) {

                        if (profiles[message.author.id].hasOwnProperty(args[0].toLowerCase())){
                            delete profiles[message.author.id][args[0].toLowerCase()];

                            message.reply(`removed ${args[0]}!`);

                            // Save data
                            utils.write(profiles, 'profiles', 'profiles');
                        }
                    }
                }
            }
        },

        profilesocials: {
            name: 'profilesocials',
            help: 'Add/remove a social media profile',
            syntax: 'profilesocials {add/remove} {Name} [Link]',
            aliases: ['socials', 'social'],
            main: function (message, args) {

                
                if (args.length < 2) {
                    message.reply(`${config.locales.syntaxError} \`${this.syntax}\``);
                } else { // Check for arguments
                    switch (args[0].toLowerCase()){

                        // Add social
                        case 'add':
                        case 'set':

                            // Check length
                            if (args.length < 3){
                                message.reply(`please use \`profilesocials ${args[0]} {Name} {Link}\``);
                            } else {

                                // Check if has socials field
                                if (!profiles[message.author.id].hasOwnProperty('socials')) {
                                    profiles[message.author.id]['socials'] = {}
                                }

                                var soc = args.slice(1, args.length - 1).join(' ')

                                // Check if link begins w http:// or https://
                                if (args.slice(-1)[0].startsWith('http://') || args.slice(-1)[0].startsWith('https://')){
                                    profiles[message.author.id]['socials'][`${soc}`] = args.slice(-1)[0]
                                } else {
                                    profiles[message.author.id]['socials'][`${soc}`] = 'http://' + args.slice(-1)[0]
                                }


                                message.reply(`added ${soc}!`);

                                utils.write(profiles, 'profiles', 'profiles')

                            }
                            break;
                        
                        // Remove socials
                        case 'remove':
                        case 'delete':
                            if (args.length < 2) {
                                message.reply(`please use \`profilesocials ${args[0]} {Name}\``);
                            } else {
                                var soc = args.slice(1, args.length).join(' ')

                                // Check if has socials field
                                if (!profiles[message.author.id].hasOwnProperty('socials')) {
                                    profiles[message.author.id]['socials'] = {}
                                }

                                if (profiles[message.author.id]['socials'].hasOwnProperty(soc)) {
                                    delete profiles[message.author.id]['socials'][soc];
                                }

                                message.reply(`removed ${soc}!`);

                                utils.write(profiles, 'profiles', 'profiles')

                            }
                            break;

                        default:
                            message.reply(`${config.locales.syntaxError} \`${this.syntax}\``);
                            break;
                    }
                }
            }
            
        }
    }
}