const Discord = require('discord.js');  // Import Discord
var config = require('../config.json'); // Import config
var utils = require('../utils.js')      // Import utilities
var kira = require('../kira.js')        // Import Kira
const fs = require('fs');               // File Stream
const chalk = require('chalk');         // Colored Console Logging


// Write guild permission data
function writeGuildPermissionData(guildID, level, roleToAdd){
    // Read guild data
    guildData = JSON.parse(utils.read('guilds', guildID, true));

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
        name: 'Admin',
        description: 'Bot administration commands',
        version: '1.1.0'
    },

    commands: {
        shutdown: {
            name: 'shutdown',
            help: 'Shuts down the bot. Bot owner only.',
            syntax: 'shutdown',
            aliases: ['sd'],
            main: function (message, args) {
                // Check for bot ownership
                if (utils.getPermissionLevel(message) == 6){
                    // Reply with pong
                    message.client.destroy();
                } else {
                    message.reply(config.locales.noPerms)
                }
            }
        },

        listservers: {
            name: 'listservers',
            help: 'Lists all servers the bot is in. Bot owner only.',
            syntax: 'listservers',
            aliases: ['ls'],
            main: function (message, args) {
                // Check for bot ownership
                if (utils.getPermissionLevel(message) == 6) {
                    // Reply with pong
                    guilds = message.client.guilds.cache.array()
                    message.reply(`here are all my guilds:\n\`${guilds.join('`, `')}\``);
                } else {
                    message.reply(config.locales.noPerms);
                }
            }
        },

        reload: {
            name: 'reload',
            help: 'Reloads module. Bot owner only',
            syntax: 'reload {module}',
            main: function (message, args) {
                // Check for bot ownership
                if (utils.getPermissionLevel(message) == 6) {

                    if (args.length == 0){
                        message.reply('please specify a module to reload');
                        return;
                    }

                    // Get commands
                    var { commands } = message.client;

                    // Lowercase module name
                    moduleLower = args[0].toLowerCase()

                    // Check if module in commands
                    if (commands.has(moduleLower)){

                        // 
                        // REMOVAL CODE
                        // 
                        // Delete from commands
                        commands.delete(moduleLower);
                        console.log(`Unloaded ${moduleLower}`);
                        delete require.cache[require.resolve(`../modules/${moduleLower}.js`)];
                        delete kira.file[`${moduleLower}.js`];

                        // 
                        // ADDING CODE
                        // 
                        // Set the require of the file
                        var fileName = moduleLower + '.js';
                        kira.file[fileName] = require(`../modules/${fileName}`);

                        // Module name is the lowercase of the module.name parameter
                        var moduleName = kira.file[fileName].module.name.toLowerCase();

                        // If the module isn't specifies in the config, break
                        if (!config.modules.includes(moduleName)) return;

                        // Add the module name to the modules var
                        // modules.push(moduleName);

                        // Set the module name in bot commands
                        commands.set(moduleName, new Discord.Collection())

                        // Iterate through commands in file
                        for (var cmd in kira.file[fileName].commands) {
                            // set a new item in the Collection
                            // with the key as the command name and the value as the exported module
                            try {
                                commands.get(moduleName).set(kira.file[fileName]["commands"][cmd].name, kira.file[fileName]["commands"][cmd]);
                                console.log(`Loaded command ${chalk.greenBright(cmd)} from ${chalk.green(fileName)}`)
                            } catch (e) {
                                console.log(e);
                                console.log(`${chalk.red('[ERROR]')} Unable to load command ${chalk.redBright(name)} from ${chalk.red(fileName)}`);
                            }

                            // Aliases
                            if ('aliases' in kira.file[fileName]["commands"][cmd]) {
                                for (alias in kira.file[fileName]["commands"][cmd]['aliases']) {
                                    try {
                                        commands.get(moduleName).set(kira.file[fileName]["commands"][cmd]['aliases'][alias], kira.file[fileName]["commands"][cmd]);
                                        console.log(`Loaded alias for ${chalk.greenBright(cmd)} from ${chalk.green(fileName)}`)
                                    } catch (e) {
                                        console.log(e);
                                        console.log(`${chalk.red('[ERROR]')} Unable to load alias for command ${chalk.redBright(name)} from ${chalk.red(fileName)}`);
                                    }
                                }
                            }
                        }

                        message.reply(`Reloaded "${moduleLower}"`);

                    } else {
                        message.reply(`The module "${moduleLower}" is not currently loaded`)
                    }





                } else {
                    message.reply(config.locales.noPerms);
                }
            }
        },

        load: {
            name: 'load',
            help: 'Loads module. Bot owner only',
            syntax: 'load {module}',
            main: function (message, args) {
                // Check for bot ownership
                if (utils.getPermissionLevel(message) == 6) {

                    // Get commands
                    var { commands } = message.client;

                    // Lowercase module name
                    moduleLower = args[0].toLowerCase();

                    // Check if module in commands
                    if (!commands.has(moduleLower)) {

                        var fileName = moduleLower + '.js';
                        kira.file[fileName] = require(`../modules/${fileName}`);
                        kira.modules.push(moduleLower);



                        config.modules.push(moduleLower);
                        fs.writeFile('./config.json', JSON.stringify(config, null, 2), function(){});


                        // Module name is the lowercase of the module.name parameter
                        var moduleName = kira.file[fileName].module.name.toLowerCase();

                        // If the module isn't specifies in the config, break
                        if (!config.modules.includes(moduleName)) return;

                        // Add the module name to the modules var
                        // modules.push(moduleName);

                        // Set the module name in bot commands
                        commands.set(moduleName, new Discord.Collection())

                        // Iterate through commands in file
                        for (var cmd in kira.file[fileName].commands) {
                            // set a new item in the Collection
                            // with the key as the command name and the value as the exported module
                            try {
                                commands.get(moduleName).set(kira.file[fileName]["commands"][cmd].name, kira.file[fileName]["commands"][cmd]);
                                console.log(`Loaded command ${chalk.greenBright(cmd)} from ${chalk.green(fileName)}`)
                            } catch (e) {
                                console.log(e);
                                console.log(`${chalk.red('[ERROR]')} Unable to load command ${chalk.redBright(name)} from ${chalk.red(fileName)}`);
                            }

                            // Aliases
                            if ('aliases' in kira.file[fileName]["commands"][cmd]) {
                                for (alias in kira.file[fileName]["commands"][cmd]['aliases']) {
                                    try {
                                        commands.get(moduleName).set(kira.file[fileName]["commands"][cmd]['aliases'][alias], kira.file[fileName]["commands"][cmd]);
                                        console.log(`Loaded alias for ${chalk.greenBright(cmd)} from ${chalk.green(fileName)}`)
                                    } catch (e) {
                                        console.log(e);
                                        console.log(`${chalk.red('[ERROR]')} Unable to load alias for command ${chalk.redBright(name)} from ${chalk.red(fileName)}`);;
                                    }
                                }
                            }
                        }

                        message.reply(`Loaded "${moduleLower}"`);

                    } else {
                        message.reply(`The module "${moduleLower}" is already loaded or does not exist`)
                    }

                } else {
                    message.reply(config.locales.noPerms);
                }
            }
        },

        unload: {
            name: 'unload',
            help: 'unloads module. Bot owner only',
            syntax: 'unload {module}',
            main: function (message, args) {
                // Check for bot ownership
                if (utils.getPermissionLevel(message) == 6) {

                    if (args.length == 0) {
                        message.reply('please specify a module to unload');
                        return;
                    }

                    // Get commands
                    var {
                        commands
                    } = message.client;

                    // Lowercase module name
                    moduleLower = args[0].toLowerCase()

                    // Check if module in commands
                    if (commands.has(moduleLower)) {

                        // 
                        // REMOVAL CODE
                        // 
                        // Delete from commands
                        commands.delete(moduleLower);
                        console.log(`Unloaded ${moduleLower}`);
                        delete require.cache[require.resolve(`../modules/${moduleLower}.js`)];
                        delete kira.file[`${moduleLower}.js`];

                        // Remoove req from config
                        var i = config.modules.indexOf(moduleLower);
                        if (i != -1) {
                            config.modules.splice(i, 1);
                        }
                        fs.writeFile('./config.json', JSON.stringify(config, null, 2),  function(){ console.log('Wrote config') });

                        // Remoove mod from kira
                        var i = kira.modules.indexOf(moduleLower);
                        if (i != -1) {
                            kira.modules.splice(i, 1);
                        }



                        message.reply(`Unloaded "${moduleLower}"`);

                    } else {
                        message.reply(`The module "${moduleLower}" is not currently loaded`)
                    }





                } else {
                    message.reply(config.locales.noPerms);
                }
            }
        },

        setguildrole: {
            name: 'setguildrole',
            help: 'Sets permission levels for your guild by providing a Role ID or mentioning the role. Guild owner only.',
            syntax: 'setguildrole {moderator/admin/coowner} {Role Name/Role ID}',
            aliases: ['setpermissionlevel'],
            main: function (message, args) {
                // Check for bot ownership
                if (utils.getPermissionLevel(message) >= 4) {

                    // Invalid Length
                    if (args.length < 2){
                        message.reply(`Please use \`${this.syntax}\``);
                    }

                    else {
                        
                        // Check for valid role
                        if (message.mentions.roles.array().length == 1 || !isNaN(args[1])){
                            var roleToAdd;
                            if (isNaN(args[1])) {
                                roleToAdd = message.mentions.roles.first().id;
                            } else {
                                roleToAdd = args[1];
                            }


                            // Check for permission levels
                            switch (args[0].toLowerCase()) {
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