const Discord = require('discord.js');      // Import Discord
var config = require('../config.json');     // Import config
var utils = require('../utils.js')          // Import utilities


module.exports = {
    module: {
        name: 'Moderation',
        description: 'A moderation module',
        version: '1.1.0',
        source: 'https://raw.githubusercontent.com/gabrielchantayan/Kira/master/modules/moderation.js',
        authors: ['Gab#2302']
    },

    commands: {
        pindg: {
            name: 'pindg',
            help: 'A basic ping command',
            syntax: 'ping',
            main: function (message, args) {
                // Reply with pong
                
            }
        },
    }
}