const Discord = require('discord.js');      // Import Discord
var config = require('../config.json');     // Import config
var utils = require('../utils.js')          // Import utilities


module.exports = {
    module: {
        name: 'TEMPLATE',
        description: 'Template Module',
        version: '0.0.1',
        source: 'https://raw.githubusercontent.com/gabrielchantayan/Kira/master/modules/!TEMPLATE.js',
        authors: ['Gab#2302']
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