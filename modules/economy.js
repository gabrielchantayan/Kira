const Discord = require('discord.js');                  // Import Discord
var config = require('../config.json');                 // Import config
var econConfig = require('../data/economy/config.json') // Econ config
var utils = require('../utils.js')                      // Import utilities


module.exports = {
    module: {
        name: 'TEMPLATE',
        description: 'Template',
        version: '1.0.0',
        source: 'https://raw.githubusercontent.com/gabrielchantayan/Kira/master/modules/economy.js',
        authors: ['Gab#2302']
    },

    commands: {
        bal: {
            name: 'bal',
            help: 'Check balances',
            syntax: 'bal',
            aliases: ['balance', '$'],
            main: function (message, args) {
                // Read balance
                var bal = this.checkBalance(message.author, message.guild.id);

                // Send balance
                message.reply(`your balance is ${econConfig.prefix}${bal}`);
            }
        },
    },

    validateBalance: function (user, guildID) {
        // Read file
        let balFile = utils.read('economy', 'balances');
        let valid = true;

        // Check if file is null
        if (balFile == null) { balFile = {}; valid = false; }
        if (balFile[guild] == null) { balFile[guildID] = {}; valid = false; }
        if (balFile[guildID][user.id] == null) {
            balFile[guildID][user.id] = {
                'balance': 0,
                'totalBalance': 0
            };
            valid = false;
        }

        // If invalid file, write data
        if (!valid) utils.write(balFile, 'economy', 'balances');
    },

    checkBalance: function (user, guildID) {
        // Validate balances
        this.validateBalance(user, guildID);

        // Read file
        let balFile = utils.read('economy', 'balances');

        // Check if file is null, if so return 0
        // if (balFile == null) return 0;

        // Return with user's balance otherwise
        return balFile[guildID][user.id]['balance'];
    },

    addMoney: function (user, guildID, amount) {
        // Validate balances
        this.validateBalance(user, guildID);

        // Read file
        let balFile = utils.read('economy', 'balances');

        // Add balance
        balFile[guildID][user.id]['balance'] += amount;
        
        // If amount is pos
        if (amount > 0) {
            balFile[guildID][user.id]['totalBalance'] += amount;
        }

        // Write the file
        utils.write(balFile, 'economy', 'balances');

    }
}