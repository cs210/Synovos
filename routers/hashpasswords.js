"use strict";
/* jshint node: true */

var crypto = require('crypto');

(function() {
    /*
 * Return a salted and hashed password entry from a
 * clear text password.
 * @param {string} clearTextPassword
 * @return {object} passwordEntry
 * where passwordEntry is an object with two string
 * properties:
 *      salt - The salt used for the password.
 *      hash - The sha1 hash of the password and salt
 */
    function makePasswordEntry(clearTextPassword) {

        var salt = crypto.randomBytes(8).toString('hex');
        var hash = crypto.createHash('sha1');
        hash.update(clearTextPassword + salt);
        return {
            salt: salt,
            hash: hash.digest().toString('hex')
        };
    }

    /*
     * Return true if the specified clear text password
     * and salt generates the specified hash.
     * @param {string} hash
     * @param {string} salt
     * @param {string} clearTextPassword
     * @return {boolean}
     */
    function doesPasswordMatch(hash, salt, clearTextPassword) {
        var hash_new = crypto.createHash('sha1');
        hash_new.update(clearTextPassword + salt);
        var check = hash_new.digest().toString('hex');
        if(check === hash){
            return true;
        } else{
            return false;
        }
    }
    exports.makePasswordEntry = makePasswordEntry;
    exports.doesPasswordMatch = doesPasswordMatch;
})();

