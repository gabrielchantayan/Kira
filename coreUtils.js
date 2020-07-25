///////////////////////////////////////////////////
// THIS IS THE UTILS FILE FOR THE MAIN KIRA FILE //
//     THIS IS NOT TO BE USED BY ANY MODULES     //
//  PLEASE USE UTILS.JS FOR ALL MODULE UTILITIES //
///////////////////////////////////////////////////

// Load config
var config = require('./config.json')

// Set prefixes
var prefixes = config.prefixes

// Exports
module.exports = {

    // Prefix Check
    checkPrefix: function (message) {
        // Itereate through all prefixes
        for (prefix in prefixes) {
            // Get length of prefix, then check if message starts with prefix
            if (message.substring(0, prefixes[prefix].length) == prefixes[prefix]) {
                return [true, message.slice(prefix.length)];
            } else continue;
        }

        // Else return false
        return [false];
    }
}