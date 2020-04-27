"use strict";

/* jshint node: true */
/* global Promise */

// We use the Mongoose to define the schema stored in MongoDB.
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const connectionURI = 'mongodb+srv://backenduser:fXgre5eVj1R6CA76@cluster0-sh7sn.mongodb.net/test?retryWrites=true&w=majority';
mongoose.connect(connectionURI, { useNewUrlParser: true, useUnifiedTopology: true });

// Load the Mongoose
var User = require('./schema/user.js');

// We start by removing anything that existing in the collections.
var removePromises = [User.deleteMany({})];

Promise.all(removePromises).then(function () {

}).catch(function(err){
    console.error('Error create schemaInfo', err);
});
