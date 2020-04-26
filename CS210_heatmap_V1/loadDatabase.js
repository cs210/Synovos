"use strict";

/* jshint node: true */
/* global Promise */

// We use the Mongoose to define the schema stored in MongoDB.
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

mongoose.connect('mongodb://localhost/cs142project6', { useNewUrlParser: true, useUnifiedTopology: true });

// Load the Mongoose
var SchemaInfo = require('./schema/schemaInfo.js');

var versionString = '1.0';

// We start by removing anything that existing in the collections.
var removePromises = [SchemaInfo.deleteMany({})];

Promise.all(removePromises).then(function () {

    SchemaInfo.create({
        version: versionString
    }).then(function (schemaInfo) {
        console.log('SchemaInfo object created with version ', schemaInfo.version);
        mongoose.disconnect();
    }).catch(function(err){
        console.error('Error create schemaInfo', err);
    });

}).catch(function(err){
    console.error('Error create schemaInfo', err);
});
