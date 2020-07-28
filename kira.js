// Packages
const fs = require('fs');                       // File Stream
const Discord = require('discord.js');          // Discord
const bot = new Discord.Client();               // Bot object
const date = require('date-and-time');          // Dates
const chalk = require('chalk');                 // Colored Console Logging
const fetch = require('node-fetch');            // HTTP requests

// Files
var config = require('./config.json');          // Config
var coreUtils = require('./coreUtils.js');      // Core utilities
var utils = require('./utils.js');              // Other Utilities
const token = require('./token.json');          // Bot Token
const version = require('./version.json');      // Version number

var prefixes = config.prefixes;                 // All bot prefixes
var processingCommands = true;                  // If the bot is processing commands or not
const pattern = date.compile('HH:mm:ss');       // Date format

function shutDown(){
    processingCommands = false;
}

modules=[];
var file = {};

module.exports = {
    modules : modules,
    file : file
}

// 
///////////////////////
//    BOT MODULES    //
///////////////////////
// 

// Bot commands
bot.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./modules').filter(file => file.endsWith('.js'));


// Search through files in modules
for (const fileName of commandFiles) {
    // Log the fileName loaded
    console.log(chalk `{cyan Loaded file} {cyanBright ${fileName}}`)

    // Set the require of the file
    file[fileName] = require(`./modules/${fileName}`);

    // Module name is the lowercase of the module.name parameter
    var moduleName = file[fileName].module.name.toLowerCase();

    // If the module isn't specifies in the config, break
    if (!config.modules.includes(moduleName)) {
        console.log('Module not currently loaded, skipping.')
        continue
    }

    // Add the module name to the modules var
    modules.push(moduleName);

    // Set the module name in bot commands
    bot.commands.set(moduleName, new Discord.Collection())

    // Iterate through commands in file
    for (var cmd in file[fileName].commands) {
        // set a new item in the Collection
        // with the key as the command name and the value as the exported module
        try {
            bot.commands.get(moduleName).set(file[fileName]["commands"][cmd].name, file[fileName]["commands"][cmd]);
            console.log(`Loaded command ${chalk.greenBright(cmd)} from ${chalk.green(fileName)}`)
        }
        catch (e) {
            console.log(e);
            console.log(`${chalk.red('[ERROR]')} Unable to load command ${chalk.redBright(name)} from ${chalk.red(fileName)}`);
        }

        // Aliases
        if ('aliases' in file[fileName]["commands"][cmd]) {
            for (alias in file[fileName]["commands"][cmd]['aliases']) {
                try {
                    bot.commands.get(moduleName).set(file[fileName]["commands"][cmd]['aliases'][alias], file[fileName]["commands"][cmd]);
                    console.log(`Loaded alias for ${chalk.greenBright(cmd)} from ${chalk.green(fileName)}`)
                } catch (e) {
                    console.log(e);
                    console.log(`${chalk.red('[ERROR]')} Unable to load alias for command ${chalk.redBright(name)} from ${chalk.red(fileName)}`);
                }
            }
        }
    }

    console.log('Finished loading modules')
}



// 
////////////////////////////
//    VERSION CHECKING    //
////////////////////////////
// 

// Kira version checking

function checkKiraVersion(json) {
    if (coreUtils.checkIfGreaterVersionNumber(version.version, json.version)) {
        console.log(chalk `{green [}{greenBright NOTICE}{green ]} There is an update available for Kira!`);
        console.log(chalk `{cyan Current version: }{cyanBright ${version.version}}`);
        console.log(chalk `{cyan Latest version: }{cyanBright ${json.version}}`);
    } else {
        console.log(chalk `{cyanBright No updates available}`);
    }
}

try {
    fetch('https://raw.githubusercontent.com/gabrielchantayan/Kira/master/version.json')
        .then(res => res.json())
        .then(json => checkKiraVersion(json));
} catch (e) {
    console.log(`${chalk.red('[ERROR]')} Unable to check for updates`);
}


// Module version checking

// function checkModuleVersion(json, module) {
//     if (coreUtils.checkIfGreaterVersionNumber(module['version'], json.version)) {
//         console.log(chalk `{green [}{greenBright NOTICE}{green ]} There is an update available for the module {greenbright ${module['name']}}`);
//         console.log(chalk `{cyan Current version: }{cyanBright ${version}}`);
//         console.log(chalk `{cyan Latest version: }{cyanBright ${module['version']}}`);
//         console.log(chalk `You can download the update here: {blueBright ${module['source']}}`);
//     } else {
//         console.log(chalk `{cyanBright No updates available}`);
//     }
// }


// // Loop through files
// for (var moduleName in file) {
//     // console.log(file[moduleName]['module']['version'])
//     try {
//         fetch(file[moduleName]['module']['source'])
//             .then(res => res.body())
//             .then(res => checkModuleVersion(res), file[moduleName]['module']);
//     } catch (e) {
//         console.log(`${chalk.red('[ERROR]')} Unable to check for update for ${chalk.redBright(file[moduleName]['module']['name'])}`);
//     }
// }



// 
//////////////////////////
//    BOT PROCESSING    // 
//////////////////////////
// 


bot.on('ready', () => {
    console.log(chalk`{green Logged in as }{greenBright ${bot.user.tag}}{green !}`);
});

bot.on('message', message => {
    
    // Check if bot is currently processing commands
    if (processingCommands) {

        // Check for valid command
        if (message.author.bot) return; // Check if command is said by author, if so skip
        let checkPrefixReturn = coreUtils.checkPrefix(message.content); // Function to check prefix and return valid message
        if (!checkPrefixReturn[0]) return; // Check if valid prefix

        // Set up command and arguments
        let command = checkPrefixReturn[1].split(" ")[0].toLowerCase(); // Command is the lowercase of the first item of checkPrefixReturn(" ")[1]
        let args = checkPrefixReturn[1].split(" ").slice(1); // Args is everything else

        // Iterate through modules
        for(module in modules){

            // Check if bot has command
            if (!bot.commands.get(modules[module]).has(command)) continue;
    

            // Command logging
            // Get the date object
            const now = new Date(); // Get date object

            // Log the message
            // [HH:mm:ss] (#) Name @ Server: command [args] 
            console.log(chalk`[${date.format(now, pattern)}] (${utils.getPermissionLevel(message)}) {grey ${message.author.username}} @ {grey ${message.guild.name}}: ${checkPrefixReturn[1]}`)
    
            // Try to run command, if not reply that an error occured and log the error
            try {
                bot.commands.get(modules[module]).get(command).main(message, args);
                break;
            } catch (error) {
                console.error(error);
                message.reply('there was an error trying to execute that command!');
                var embed = utils.buildEmbed({
                    'title': 'An error has occured',
                    'color': '#d00000',
                    'fields': [
                        ['STDOut', error]
                    ]
                })
                message.channel.send({embed})
                break;
            }
        }


        
    }

});

// Login
bot.login(token.token);