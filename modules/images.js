const Discord = require('discord.js');      // Import Discord
var config = require('../config.json');     // Import config
var utils = require('../utils.js');         // Import utilities
const fs = require('fs');                   // File Stream

module.exports = {
    module: {
        name: 'Images',
        description: 'Image commands',
        version: '1.0.1'
    },

    commands: {
        pseudocolor_2: {
            name: 'pseudocolor_2',
            help: 'pseudocolor_2.gif',
            syntax: 'pseudocolor_2',
            main: function (message, args) {
                message.channel.send({
                    files: [{
                        attachment: 'data/images/pseudocolor_2.gif',
                        name: 'pseudocolor_2.gif'
                    }]
                })
            }
        },

        bert: {
            name: 'bert',
            help: 'bert',
            syntax: 'bert',
            main: function (message, args) {
                message.channel.send({
                    files: [{
                        attachment: 'data/images/ernie.png',
                        name: 'ernie.png'
                    }]
                })
            }
        },

        braindamage: {
            name: 'braindamage',
            help: 'Do you have brain damage?',
            syntax: 'braindamage',
            main: function (message, args) {
                message.channel.send({
                    files: [{
                        attachment: 'data/images/braindamage.jpg',
                        name: 'braindamage.jpg'
                    }]
                });

                try {
                    message.delete();
                } catch {}
            }
        },

        sansbaby: {
            name: 'sansbaby',
            help: 'sansbaby',
            syntax: 'sansbaby',
            main: function (message, args) {
                message.channel.send({
                    files: [{
                        attachment: 'data/images/sansbaby.jpg',
                        name: 'sansbaby.jpg'
                    }]
                })
            }
        },

         juicethatmakesyoulookatgaypeople: {
            name: 'juicethatmakesyoulookatgaypeople',
            help: 'Juice that makes you look at gay people',
            syntax: 'juicethatmakesyoulookatgaypeople',
            aliases: ['gaypeoplejuice', 'gayjuice'],
            main: function (message, args) {
                message.channel.send({
                    files: [{
                        attachment: 'data/images/juicethatmakesyoulookatgaypeople.png',
                        name: 'juicethatmakesyoulookatgaypeople.png'
                    }]
                });

                try {
                    message.delete();
                } catch {}
            }
        },

        hotgirlwithpizza: {
            name: 'hotgirlwithpizza',
            help: 'wow that girl with pizza is really hot who is she',
            syntax: 'hotgirlwithpizza',
            main: function (message, args) {
                message.channel.send({
                    files: [{
                        attachment: 'data/images/hotgirlwithpizza.jpg',
                        name: 'hotgirlwithpizza.jpg'
                    }]
                })
            }
        },

        thisiswhativebeencraving: {
            name: 'thisiswhativebeencraving',
            help: 'thisiswhativebeencraving',
            syntax: 'thisiswhativebeencraving',
            aliases: ['craving'],
            main: function (message, args) {
                message.channel.send({
                    files: [{
                        attachment: 'data/images/thisiswhativebeencraving.jpg',
                        name: 'thisiswhativebeencraving.jpg'
                    }]
                })
            }
        },
    }
}