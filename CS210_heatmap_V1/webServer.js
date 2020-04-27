"use strict";

/* jshint node: true */

// We use the Mongoose to define the schema stored in MongoDB.
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var async = require('async');

const connectionURI = 'mongodb+srv://backenduser:fXgre5eVj1R6CA76@cluster0-sh7sn.mongodb.net/test?retryWrites=true&w=majority';
mongoose.connect(connectionURI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.once('open', function(){
    console.log("MongoDB databse connection established successfully");
});
db.on('error', (error) => console.log(error));

// We use ExpressJS as a MiddleWare
var express = require('express');
var app = express();
app.use(express.json());

var session = require('express-session');

// We have the express static module (http://expressjs.com/en/starter/static-files.html) do all
// the work for us.
app.use(express.static(__dirname));

// ExpressJS has a middleware layer for dealing with the session state
app.use(session({
    secret: 'secretKey',
    resave: false,
    saveUninitialized: false,
}));

// Node.js body parsing middleware.
// Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
var bodyParser = require('body-parser');

// Use bodyParser for JSON
app.use(bodyParser.json());

const buildingsRouter = require('./routers/buildingsRouter');
app.use('/buildings', buildingsRouter);

const sensorDataRouter = require('./routers/sensorDataRouter');
app.use('/sensorData', sensorDataRouter);

const occupancyDataRouter = require('./routers/occupancyDataRouter');
app.use('/occupancyData', occupancyDataRouter);

const adminControls = require('./routers/adminControls');
app.use('/admin', adminControls);


var server = app.listen(3000, function () {
    var port = server.address().port;
    console.log('Listening at http://localhost:' + port + ' exporting the directory ' + __dirname);
});


