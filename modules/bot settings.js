const Discord = require('discord.js');      // Import Discord
var config = require('../config.json');     // Import config
var utils = require('../utils.js')          // Import utilities

// Write guild permission data
function writeGuildPermissionData(guildID, level, roleToAdd) {
    // Read guild data
    guildData = utils.read('guilds', guildID, true);

    // Fallbacks in case guild data doesn't have required paths
    if (guildData['permissions'] == null) {
        guildData['permissions'] = {};
    }

    // Add role to guild data
    guildData['permissions'][level] = roleToAdd;

    // Write data
    utils.write(guildData, 'guilds', guildID)
}

module.exports = {
    module: {
        name: 'Bot Settings',
        description: 'Change the bot\'s settings',
        version: '1.1.0',
        source: 'https://raw.githubusercontent.com/gabrielchantayan/Kira/master/modules/bot settings.js'
    },

    commands: {
        permissions: {
            name: 'permissions',
            help: 'Sets permission levels for your guild by providing a Role ID or mentioning the role. Guild owner only.',
            syntax: 'permissions {helper/moderator/admin/coowner} {Role Name/Role ID}',
            aliases: ['setguildrole', 'setpermissionlevel'],
            main: function (message, args) {
                // Check for bot ownership
                if (utils.getPermissionLevel(message) >= 4) {

                    // Invalid Length
                    if (args.length < 2) {
                        message.reply(`${config.locales.syntaxError} \`${this.syntax}\``);
                    } else {

                        // Check for valid role
                        if (message.mentions.roles.array().length == 1 || !isNaN(args[1])) {
                            var roleToAdd;
                            if (isNaN(args[1])) {
                                roleToAdd = message.mentions.roles.first().id;
                            } else {
                                roleToAdd = args[1];
                            }


                            // Check for permission levels
                            switch (args[0].toLowerCase()) {
                                case "jmod":
                                case "junior mod":
                                case "helper":
                                    writeGuildPermissionData(message.guild.id, 'helper', roleToAdd);
                                    message.channel.send('Guild role set!')
                                    break;
                                case "mod":
                                case "moderator":
                                    writeGuildPermissionData(message.guild.id, 'moderator', roleToAdd);
                                    message.channel.send('Guild role set!')
                                    break;
                                case "admin":
                                    writeGuildPermissionData(message.guild.id, 'admin', roleToAdd);
                                    message.channel.send('Guild role set!')
                                    break;
                                case "coowner":
                                    writeGuildPermissionData(message.guild.id, 'coowner', roleToAdd);
                                    message.channel.send('Guild role set!')
                                    break;
                                default:
                                    message.reply("Sorry, please enter a valid permission level.\nValid permission levels: `mod` `moderator` `admin` `coowner`");
                                    break;
                            }
                        }

                    }

                } else {
                    message.reply(config.locales.noPerms);
                }
            }
        }
    }
}