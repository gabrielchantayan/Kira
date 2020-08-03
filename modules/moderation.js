const Discord = require('discord.js');      // Import Discord
var config = require('../config.json');     // Import config
var utils = require('../utils.js')          // Import utilities
const date = require('date-and-time');      // Dates

const pattern = date.compile('MMM DD YYYY hh:mm A');   // Date format

module.exports = {
    module: {
        name: 'Moderation',
        description: 'A moderation module',
        version: '1.0.0',
        source: 'https://raw.githubusercontent.com/gabrielchantayan/Kira/master/modules/moderation.js',
        authors: ['Gab#2302']
    },

    commands: {
        warn: {
            name: 'warn',
            help: 'Warn a user',
            syntax: 'warn {user} [reason]',
            permissionLevel: 2,
            main: function (message, args) {
                // Check if a user is mentioned
                if (args.length == 0 || message.mentions.users.first() == null) {
                    message.channel.send(`${config.locales.syntaxError} ${this.syntax}`);
                }
                else {
                    // Big O
                    var user = message.mentions.users.first()

                    // Read warns and settings
                    var warns = utils.read('mod', 'warnings', true);
                    var settings = utils.read('mod', 'settings', true);

                    // Check if warns has guild in it; if not, make an empty array
                    if (!warns.hasOwnProperty(message.guild.id)) warns[message.guild.id] = {};

                    // Check if user doesnt have any warnings or if warnings if null; if so, set warnings to 0
                    if (!warns[message.guild.id].hasOwnProperty(user.id) || warns[message.guild.id][user.id] == null) warns[message.guild.id][user.id] = {
                        "warnings": 0,
                        "reasons": []
                    };

                    // Add to warnings
                    warns[message.guild.id][user.id]['warnings'] ++;

                    // Get date
                    const now = new Date();
                    
                    // Format warns [TIMESTAMP, REASON]
                    if (args.length > 1){
                        // Push to file
                        warns[message.guild.id][user.id]['reasons'].push([date.format(now, pattern), args.slice(1).join(' ')]);

                        // Notify user
                        message.channel.send(`Warned ${user} for ${args.slice(1).join(' ')}`);
                        user.send(`You have been warned by ${message.author} in **${message.guild.name}** for ${args.slice(1).join(' ')}`);
                    } else {
                        // Push to file
                        warns[message.guild.id][user.id]['reasons'].push([date.format(now, pattern), 'No reason specified']);

                        // Notify user
                        message.channel.send(`Warned ${user}`);
                        user.send(`You have been warned by ${message.author} in **${message.guild.name}**`);
                    }

                    
                    let guildMember = message.guild.member(user);

                    if (settings[message.guild.id].hasOwnProperty(`${warns[message.guild.id][user.id]['warnings']}`)){
                        switch (settings[message.guild.id][`${warns[message.guild.id][user.id]['warnings']}`]){
                            case 'kick':
                                user.send(`You have been kicked from the server, as you have reached ${warns[message.guild.id][user.id]['warnings']} warnings.`);
                                setTimeout(function () {
                                    guildMember.kick();
                                }, 350);
                                break;
                            case 'ban':
                                user.send(`You have been banned from the server, as you have reached ${warns[message.guild.id][user.id]['warnings']} warnings.`);
                                setTimeout(function () {
                                    guildMember.ban();
                                }, 350);
                                break;
                        }
                    }
                    
                    // Write warns
                    utils.write(warns, 'mod', 'warnings');
                }
            }
        },
        warnings: {
            name: 'warnings',
            help: 'List all of a user\'s warnings',
            syntax: 'warnings [user]',
            aliases: ['warns'],
            main: function (message, args) {
                var person = message.mentions.users.first();
                // Check if no waifu
                if (args.length == 0 || message.mentions.users.first() == null) {
                    person = message.author;
                }

                var warns = utils.read('mod', 'warnings', true);
                if (!warns.hasOwnProperty(message.guild.id) || warns[message.guild.id] == {} || !warns[message.guild.id].hasOwnProperty(person.id)) message.channel.send(`${person} has no warnings`);
                else {
                    var embedData = {
                        'title': `${person.username}'s warnings`,
                        'description': `Total number of warnings: ${warns[message.guild.id][person.id]['warnings']}`,
                        'thumbnail': `${person.avatarURL()}`,
                        'fields': []
                    }
                    for (warn in warns[message.guild.id][person.id]['reasons']) {
                        embedData['fields'].push([warns[message.guild.id][person.id]['reasons'][warn][0], warns[message.guild.id][person.id]['reasons'][warn][1]]);
                    }


                    var embed = utils.buildEmbed(embedData);

                    message.channel.send({
                        embed
                    });
                }
            }
        },
        removewarn: {
            name: 'removewarn',
            help: 'Remove a user\'s warnings',
            syntax: 'removewarn {user} [reason]',
            permissionLevel: 2,
            main: function (message, args) {
                // Check if a user is mentioned
                if (args.length == 0 || message.mentions.users.first() == null) {
                    message.channel.send(`${config.locales.syntaxError} ${this.syntax}`);
                } else {
                    // Big O
                    var user = message.mentions.users.first()

                    // Read warns and settings
                    var warns = utils.read('mod', 'warnings', true);

                    // Check if warns has guild in it; if not, make an empty array
                    if (!warns.hasOwnProperty(message.guild.id)) warns[message.guild.id] = {};

                    // Check if user doesnt have any warnings or if warnings if null; if so, set warnings to 0
                    if (!warns[message.guild.id].hasOwnProperty(user.id) || warns[message.guild.id][user.id] == null) warns[message.guild.id][user.id] = {
                        "warnings": 0,
                        "reasons": []
                    };

                    // Add to warnings
                    warns[message.guild.id][user.id]['warnings']--;

                    // Get date
                    const now = new Date();

                    // Format warns [TIMESTAMP, REASON]
                    if (args.length > 1) {
                        // Push to file
                        warns[message.guild.id][user.id]['reasons'].push([date.format(now, pattern), '[REMOVED WARNING] ' + args.slice(1).join(' ')]);
                        
                        // Notify user
                        message.channel.send(`Removed warning from ${user} for ${args.slice(1).join(' ')}`);
                        user.send(`You have had a warning removed by ${message.author} in **${message.guild.name}** for ${args.slice(1).join(' ')}`);
                    } else {
                        // Push to file
                        warns[message.guild.id][user.id]['reasons'].push([date.format(now, pattern), 'Warning removed. No reason specified.']);
                        
                        // Notify user
                        message.channel.send(`Removed warning from ${user}`);
                        user.send(`You have had a warning removed by ${message.author} in **${message.guild.name}**`);
                    }

                    // Write warns
                    utils.write(warns, 'mod', 'warnings');
                }
            }
        },
        punishments: {
            name: 'punishments',
            help: 'List all punishments',
            syntax: 'punishments',
            main: function (message, args) {
                var file = utils.read('mod', 'settings', true);
                if (!file.hasOwnProperty(message.guild.id) || file[message.guild.id] == {}) message.channel.send('No punishments are currently set up. Please use `~setpunishments` to configure');
                else {
                    var embedData = {
                        'title': 'Punishments',
                        'fields': []
                    }
                    for (punishment in file[message.guild.id]) {
                        embedData['fields'].push([`${punishment} Warnings`, utils.capitalize(file[message.guild.id][punishment])]);
                    }
                    
                    var embed = utils.buildEmbed(embedData);

                    message.channel.send({embed});
                }
            }
        },
        setpunishment: {
            name: 'setpunishment',
            help: 'Set punishments for x warnings',
            syntax: 'setpunishment {number of warns} {kick/ban/remove}',
            permissionLevel: 4,
            main: function (message, args) {
                if (args.length != 2 || !utils.isNumber(args[0])) message.channel.send(`${config.locales.syntaxError} ${this.syntax}`);
                else {
                    var file = utils.read('mod', 'settings', true);

                    if(!file.hasOwnProperty(message.guild.id)) file[message.guild.id] = {};

                    switch(args[1]){
                        case 'kick':
                            file[message.guild.id][args[0]] = 'kick';
                            message.channel.send(`I will now kick at ${args[0]} warnings.`)
                            utils.write(file, 'mod', 'settings');
                            break;
                        case 'ban':
                            file[message.guild.id][args[0]] = 'ban';
                            message.channel.send(`I will now ban at ${args[0]} warnings.`)
                            utils.write(file, 'mod', 'settings');
                            break;
                        case 'remove':
                            delete file[message.guild.id][args[0]];
                            message.channel.send(`I will now do nothing at ${args[0]} warnings.`)
                            utils.write(file, 'mod', 'settings');
                            break;
                        default: 
                            message.channel.send(`${config.locales.syntaxError} ${this.syntax}`);
                            break;
                    }
                }
            }
        }
    }
}