const Discord = require('discord.js');      // Import Discord
var seedrandom = require('seedrandom');     // Random number generator with seed
const fs = require('fs');                   // FS

// Load config
var config = require('./config.json');

debug = {
    debug: config.debugEnabled,
    log: function(string){
        if (this.debug) console.log(string);
    }
}

module.exports = {

    version : '1.1.2',

    // Write function
    write: function (data, module, file) {

        // Check if directory exists. If not, make it
        if (!fs.existsSync(__dirname + `/data/${module}`)) {
            fs.mkdirSync(__dirname + `/data/${module}`);
        }

        // Strinify data
        let stringifiedData = JSON.stringify(data, null, 2);

        debug.log(`Wrote to ${__dirname}/data/${module}/${file}.json`);

        // Write to ./data/MODULE/FILE.json
        fs.writeFile(__dirname + `/data/${module}/${file}.json`, stringifiedData, (err) => {
            if (err) debug.log(err);
        });
    },

    // Read function
    read: function (module, file, returnWithEmptyArray = false) {

        // Read the data
        // fs.readFile(`.\\data\\${module}\\${file}.json`, (err, data) => {
        //     if (err) {
        //         debug.log(err);
        //         return null;
        //     };

        //     // Parse and return data
        //     let parsedData = JSON.parse(data);
        //     return parsedData;
        // });
        data = {};
        try {
            debug.log(`Read from ${__dirname}/data/${module}/${file}.json`);
            return JSON.parse(fs.readFileSync(__dirname + `/data/${module}/${file}.json`));
        }
        catch (e) {
            debug.log(`An error occurred. Returning with either {} or null`)
            if (returnWithEmptyArray) { return {} }
            else return null;
        } 
 
        // Return null if no data
        // console.log('no data')
        // return null;

    },

    // Function for formatting time
    // The "type" argument specifies the end formatting
    // Type 1: dd:hh:mm:ss.ms
    // Type 2: dd days, hh hours, mm minutes, ss.ms seconds
    formatTime: function (s, type) {

        // This is weird code I wrote like two years ago and
        // im trying to comment it and figure out what the fuck
        // it does but honestly i have not a goddamn clue
        var ms = s % 1000;
        s = (s - ms) / 1000;
        var secs = s % 60;
        s = (s - secs) / 60;
        var mins = s % 60;
        s = (s - mins) / 60;
        var hrs = s % 60;
        s = (s - hrs) / 60;
        var days = s / 24;

        // Check the "type" argument and return accordingly
        switch (type) {
            case 1:
                return `${days}:${hrs}:${mins}:${secs}.${ms}`
            case 2:
                return `${days} days, ${hrs} hours, ${mins} minutes, ${secs}.${ms} seconds`
        }
    },


    // Random number generator
    seededRandom: function (seed, places = 0, shift = 0, outOf = 10) {
        // Seed the RNG
        var rng = seedrandom(seed);

        // Divide outOf by 10
        outOf /= 10;

        // Generate number and shift x places
        var generatedNumber = rng() * outOf * (10 ** (shift))

        // Round number
        var result = Math.round((generatedNumber) * (10 ** places)) / (10 ** places)
        return result;
    },

    // Gets the permission level of someone
    //   6 is bot owner
    //   5 is guild owner (Discord API return)
    //   4 is coowner (Mostly same permissions as guild owner)
    //   3 is admin
    //   2 is mod
    //   1 is junior mod/helper
    //   0 is user
    // If no permissions are setup, bot will return -1
    getPermissionLevel: function (message) {
        let user = message.author;
        let guild = message.guild;
        let guildUser = message.guild.member(user);

        // Check if user is the bot owner
        if (user.id == config.botOwner) return 6;

        // Check if user is the guild owner
        if (user.id == guild.ownerID) return 5;

        // From this point on, if those checks fail we will need to perform file reads


        // Get the guild data
        var guildData = {};
        guildData = this.read('guilds', guild.id)


        // This code is stupidly written, and could be written better.
        // However, this is the only way I could get it to work because
        // it is 4am and I just want to finish this.

        var roles = guildUser.roles.cache.array();

        for (var i = 0; i < roles.length; i++) {
            roles[i] = roles[i].id;
        }

        // Return 0 if no data avalible
        if (guildData == {} || guildData == null || guildData == undefined) return 0;

        // Check for co-owner role
        else if (guildData["permissions"]["coowner"] != null && roles.includes(guildData["permissions"]["coowner"])) return 4;

        // Check for admin role
        else if (guildData["permissions"]["admin"] != null && roles.includes(guildData["permissions"]["admin"])) return 3;

        // Check for mod role
        else if (guildData["permissions"]["moderator"] != null && roles.includes(guildData["permissions"]["moderator"])) return 2;

        // Check for helper role
        else if (guildData["permissions"]["helper"] != null && roles.includes(guildData["permissions"]["helper"])) return 1;

        // Return 0 if all else fails
        else return 0;
    },

    // Embed builder
    // Data structured as so
    // {
    //     "title" : "Lorem Ipsum",
    //     "description" : "Optional",
    //     "thumbnail" : "Optional.png",
    //     "image" : "Optional.png",
    //     "color" : "#optional",
    //     "fields" : [
    //         ["name", "content"],
    //         ["name", "content"],
    //         ["name", "content", "inline"],
    //         ["name", "content", "inline"]
    //     ]
    // }
    buildEmbed: function(data) {
        // Create the embed
        const embed = new Discord.MessageEmbed()
            .setColor(config.embedColor)
            .setTitle(data['title']);
        
        // Set the description
        if ('description' in data) embed.setDescription(data['description']);

        // Set the thumbnail
        if ('thumbnail' in data) try {
            embed.setThumbnail(data['thumbnail']);
        }
        catch {
            console.log('Invalid thumbnail')
        }

        // Set the thumbnail
        if ('image' in data) try { embed.setImage(data['image']);
        }
        catch {
            console.log('Invalid image')
        }


        // Set the color
        if ('color' in data) embed.setColor(data['color']);
        else embed.setColor(config.embedColor);

        // Set the fields
        for (field in data['fields']) {
            // Check if length == 2
            if (data['fields'][field].length == 2) embed.addField(data['fields'][field][0], data['fields'][field][1]);
            else if (data['fields'][field].length == 3) embed.addField(data['fields'][field][0], data['fields'][field][1], data['fields'][field][2]);
        }

        return embed;

    },

    // Split by x characters
    splitByCharacters: function(string, characters) {
        var reg = new RegExp('.{1,' + characters.toString() + '}\\b', 'g');
        return string.match(reg)
    },

    // Check for valid role and return role ID
    checkForValidRoleAndReturnRoleID: function(role){

    },

    // Capitalize
    capitalize: function(string) {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
    },

    // Check if value is a number
    isNumber: function(value) {
        return /^\d+$/.test(value);
    }
}