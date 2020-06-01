"use strict";

/* jshint node: true */

const PORT = process.env.HTTP_PORT || 8081;

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
app.use(bodyParser.json());

app.set('view engine', 'jade');

app.get('/', function (request, response) {
    //response.sendFile(__dirname + '/public/home.html');
    response.sendFile(__dirname + '/public/index.html');
});

app.get('/login', function (request, response) {
    response.sendFile(__dirname + '/public/index.html');
});

const buildingsRouter = require('./routers/buildingsRouter');
app.use('/buildings', buildingsRouter);

const sensorDataRouter = require('./routers/sensorDataRouter');
app.use('/sensorData', sensorDataRouter);

const adminControls = require('./routers/adminControls');
app.use('/admin', adminControls);

app.listen(PORT, () => {
  console.log(`Server listening at port ${PORT}.`);
});
