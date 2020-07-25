const Discord = require('discord.js');      // Import Discord
var config = require('../config.json');     // Import config
var utils = require('../utils.js')          // Import utilities


module.exports = {
    module: {
        name: 'Bot Settings',
        description: 'Change the bot\'s settings',
        version: '1.0.0'
    },

    commands: {
        permissions: {
            name: 'permissions',
            help: 'Edit the guild\'s permissions',
            syntax: 'permissions',
            main: function (message, args) {
                // Reply with pong
                message.channel.send('Pong');
            }
        },
    }
}