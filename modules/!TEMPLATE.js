const Discord = require('discord.js');      // Import Discord
var config = require('../config.json');     // Import config
var utils = require('../utils.js')          // Import utilities


module.exports = {
    module: {
        name: 'TEMPLATE',
        description: 'Template',
        version: '0.0.1'
    },

    commands: {
        ping: {
            name: 'ping',
            help: 'A basic ping command',
            syntax: 'ping',
            main: function (message, args) {
                // Reply with pong
                message.channel.send('Pong');
            }
        },
    }
}