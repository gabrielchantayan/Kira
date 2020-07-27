const Discord = require('discord.js');      // Import Discord
var config = require('../config.json');     // Import config
var utils = require('../utils.js')          // Import utilities
const date = require('date-and-time');      // Dates

months = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dev'];

const pattern = date.compile('MMM D');

function dayOfYear(month, day){
    var doy = 0;
    switch (month) {
        case 'jan':
            doy = 0;
            break;
        case 'feb':
            doy = 31;
            break;
        case 'mar':
            doy = 59;
            break;
        case 'apr':
            doy = 90;
            break;
        case 'may':
            doy = 120;
            break;
        case 'jun':
            doy = 151;
            break;
        case 'jul':
            doy = 181;
            break;
        case 'aug':
            doy = 212;
            break;
        case 'sep':
            doy = 243;
            break;
        case 'oct':
            doy = 273;
            break;
        case 'nov':
            doy = 304;
            break;
        case 'dec':
            doy = 334;
            break;
    }
    doy += parseInt(day);
    return doy;
}


module.exports = {
    module: {
        name: 'Birthday',
        description: 'Birthdays',
        version: '0.0.2',
        source: 'https://raw.githubusercontent.com/gabrielchantayan/Kira/master/modules/birthday.js',
        authors: ['Gab#2302']
    },

    commands: {
        birthdayset: {
            name: 'birthdayset',
            help: 'Set your birthday',
            syntax: 'birthdayset {month} {day}\nPlease use 3-letter abbreviation\n`jan` `feb` `mar` `apr` `may` `jun` `jul` `aug` `sep` `oct` `nov` `dec`',
            aliases: ['bdayset', 'setbirthday', 'setbday'],
            main: function (message, args) {
                if (args.length != 2){
                    message.reply(this.syntax);
                    return;
                }

                // Check for valid months
                if (months.indexOf(args[0].toLowerCase()) <= -1){
                    message.reply('please enter a valid 3-letter month\n`jan` `feb` `mar` `apr` `may` `jun` `jul` `aug` `sep` `oct` `nov` `dec`');
                    return;
                }

                // Check for valid day
                if (parseInt(args[1]) == NaN){
                    message.reply('please enter a valid date');
                    return;
                }

                // Read birthday json
                try {
                    birthdayJSON = utils.read('birthday', 'birthdays');
                } catch {
                    birthdayJSON = null;
                }

                // Check if null
                if (birthdayJSON == null){
                    birthdayJSON = {}
                };

                // Write in bdayjson
                birthdayJSON[message.author.id] = [`${args[0].toLowerCase()}-${args[1].replace(/\D/g,'')}`, dayOfYear(args[0].toLowerCase(), args[1].replace(/\D/g,''))];

                utils.write(birthdayJSON, 'birthday', 'birthdays');
                
                message.channel.send('Birthday set!')
            }
        },

        birthday: {
            name: 'birthday',
            help: 'View yours or someone else\'s birthday',
            syntax: 'birthday [user]',
            aliases: ['bday'],
            main: function (message, args) {
                var person = message.mentions.users.first();
                // Check if no waifu
                if (args.length == 0 || message.mentions.users.first() == null) {
                    person = message.author;
                }

                // Read birthday json
                var birthdayJSON = utils.read('birthday', 'birthdays');

                // Check if null
                if (birthdayJSON == null || !birthdayJSON.hasOwnProperty(person.id)) {
                    message.channel.send(`${person} hasn't set a birthday yet`);
                } else {
                    message.channel.send(`${person}'s birthday is ${birthdayJSON[person.id][0]}`);
                }
            }
        },

        upcomingbirthdays: {
            name: 'upcomingbirthdays',
            help: 'View upcoming birthdays',
            syntax: 'upcomingbirthdays',
            aliases: ['upcomingbdays', 'ucb'],
            main: function (message, args) {
                // Read birthday json
                var birthdayJSON = utils.read('birthday', 'birthdays');

                // Check if null
                if (birthdayJSON == null) {
                    message.channel.send('There are no upcoming birthdays.');
                } else {
                
                    // Get array of every guildmember ID
                    guildMembers = message.guild.members.cache.keyArray();

                    guildBirthdays = [];
 
                    // Iterate through guild members and check if they exist in the birthday file
                    for (member in guildMembers){
                        if (birthdayJSON.hasOwnProperty(guildMembers[member])){
                            guildBirthdays.push([guildMembers[member], birthdayJSON[guildMembers[member]][1], birthdayJSON[guildMembers[member]][0]]);
                        }
                    }

                    // Recent birthday date checking
                    var now = new Date();
                    var today = date.format(now, pattern);
                    today = dayOfYear(today.split[0], today.split[1]);

                    // Within 5 days of the past or 15 days in the future
                    for (bday in guildBirthdays){
                        if (today - 5 <= guildBirthdays[bday][1] && today + 15 >= guildBirthdays[bday][1]){}
                        else {
                            config.modules.splice(guildBirthdays.indexOf(bday), 1);
                        }
                    }

                    // Sory
                    guildBirthdays.sort(function (a, b) {
                        return a[1] - b[1];
                    });

                    var bdaylist = '';

                    // Create birthday list
                    for (bday in guildBirthdays){
                        tempMemberVar = message.guild.members.fetch(guildBirthdays[bday][0]).then((val) => {return val.displayName})
                        console.log(tempMemberVar)
                        bdaylist += `\n(${tempMemberVar}): ${guildBirthdays[bday][2]}`
                    }

                    message.channel.send(`**Recent and upcoming birthdays:**${bdaylist}`)
                }
            }
        },
    }
}