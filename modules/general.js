const Discord = require('discord.js');      // Import Discord
var config = require('../config.json');     // Import config
var utils = require('../utils.js')          // Import utilities



module.exports = {
    
    module: {
        name: 'General',
        description: 'All-purpose commands',
        version: '1.0.0'
    },

    commands: {
        ping: {
            name: 'ping',
            help: 'A basic ping command',
            syntax: 'ping',
            main: function (message, args) {
                // Reply with pong
                // message.channel.send('Pong!')
                message.channel.send(`Pong! \`${message.client.ws.ping}ms\``);
            }
        },

        bot: {
            name: 'bot',
            help: 'Information about the bot',
            syntax: 'bot {subcommand}',
            subcommands: ['stats', 'uptime'],
            main: function (message, args) {
                // Check if the subcommand is 'stats' or doesn't exist
                if (args[0] == 'stats' || args[0] == null) {
                    // Make a new embed
                    const embed = new Discord.MessageEmbed()
                        .setTitle(`Stats about ${message.client.user.username}`)
                        .setAuthor(message.client.user.username, message.client.user.avatarURL)
                        .setColor(config.embedColor)
                        .addFields(
                            { name: 'Servers', value: message.client.guilds.cache.keyArray().length, inline: true },
                            { name: 'Channels', value: message.client.channels.cache.keyArray().length, inline: true},
                            { name: 'Users', value: message.client.users.cache.keyArray().length, inline: true },
                            { name: 'Uptime', value: utils.formatTime(message.client.uptime, 1), inline: true},
                        );
                        
                    // Send the embed
                    message.channel.send({embed});
                }

                // Check if the subcommand is 'uptime'
                if (args[0] == 'uptime') {
                    // Make a new embed
                    const embed = new Discord.MessageEmbed()
                        .setAuthor(message.client.user.username, message.client.user.avatarURL)
                        .setColor(config.embedColor)
                        .addField('Uptime', utils.formatTime(message.client.uptime, 1));

                    // Send the embed
                    message.channel.send({embed});
                }                
            }
        },

        userinfo: {
            name: 'userinfo',
            help: 'Information about a user',
            syntax: 'userinfo {user}',
            aliases: ['unifo', 'user'],
            main: function (message, args) {
                // Check for args[0] and if it doesnt exist, set the user to the command author
                if (message.mentions.users.first() == null) {
                    user = message.author;
                }
                else { user = message.mentions.users.first(); }

                // Convert to guild member
                let guildMember = message.guild.member(user);

                // Get roles
                var roles = guildMember.roles.cache.array()

                for (var i = 0; i < roles.length; i++) {
                    roles[i] = roles[i].name;
                }

                // Build embed
                var embed = utils.buildEmbed({
                    'title' : `${guildMember.displayName}`,
                    'thumbnail': `${user.avatarURL()}`,
                    'fields' : [
                        ['Username', user.tag],
                        ['ID', user.id],
                        ['Created on', user.createdAt],
                        ['Joined on', guildMember.joinedAt],
                        ['Roles', roles.join(', ')]
                    ]
                })

                // Send the embed
                message.channel.send({embed});
            }
        },

        serverinfo: {
            name: 'serverinfo',
            help: 'Information about a server',
            syntax: 'serverinfo',
            aliases: ['server'],
            main: function (message, args) {
                // Set server
                var guild = message.guild;
                
                var rolesCache = guild.roles.cache.array();
                var roles = [];
                for (var i = 0; i < rolesCache.length; i++) {
                    roles[i] = rolesCache[i].name;
                }

                var dataForEmbed = {
                    'title': `Info for ${guild.name}`,
                    'thumbnail': `${guild.iconURL()}`,
                    'fields': [
                        ['ID', guild.id],
                        ['Owner', guild.owner],
                        ['Created on', guild.createdAt],
                        ['Members', guild.memberCount, true],
                        ['Channels', guild.channels.cache.array().length, true],
                        ['Roles', roles.length, true]
                    ]
                }

                var joinedRoles = roles.join(', ');

                if (joinedRoles.length <= 1020){
                    dataForEmbed['fields'].push(['Roles', joinedRoles]);
                }
                else {
                    splitRoles = utils.splitByCharacters(joinedRoles, 1000);
                    for (section in splitRoles){
                        dataForEmbed['fields'].push(['Roles', splitRoles[section]]);
                    }
                }

                // Build embed
                var embed = utils.buildEmbed(dataForEmbed)

                // Send the embed
                message.channel.send({embed});
            }
        },

        help : {
            name: 'help',
            help: 'A help command',
            syntax: 'help',
            main: function (message, args) {
                const data = [];
                const { commands } = message.client;

                // Iterate through commands, mod being the module, cms being the commands
                // commands.forEach(function (mod, cms){

                // });

                var cmds = commands.map(command => command.name);
                var help = commands.map(command => command.help);

                if(!args.length) {
                    data.push('Here\'s a list of all my commands:');

                    // Iterate through commands, mod being the module, cms being the commands
                    commands.forEach(function (cmds, mod) {
                        data.push(`**${mod.toUpperCase()}**`)

                        // Iterate through cmds
                        cmds.forEach(function(info, cmd){

                            // If a base cmd and not an alias
                            if (info['name'] == cmd){

                                // Check for aliases
                                var aliases = [];
                                if('aliases' in info){
                                    for (alias in info['aliases']){
                                        aliases.push(info['aliases'][alias]);
                                    }
                                }

                                if (aliases.length == 0){ data.push(`\`${info['name']}\`: ${info['help']}`); }
                                else{ data.push(`\`${info['name']}\`, \`${aliases.join('`, `')}\`: ${info['help']}`); }
                                
                            }
                        });
                    });
                    
                    data.push(`\nYou can send \`${config.prefixes[0]}help [command name]\` to get info on a specific command!`);

                    message.channel.send(data, {split:true});
                }
            }
        },

    }
}