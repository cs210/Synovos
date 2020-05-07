"use strict";

/* jshint node: true */

/*
 * To start the webserver run the command:
 *    node webServer.js
 *
 * Note that anyone able to connect to localhost:portNo will be able to fetch any file accessible
 * to the current user in the current directory or any of its children.
 *
 * This webServer exports the following URLs:
 * /              -  Returns a text status message.  Good for testing web server running.
 * /test/info     -  Returns the SchemaInfo object from the database (JSON format).
 * /admin/Logout
 * /admin/login
 * /user
 */

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


// Use bodyParser for JSON
//app.use(bodyParser.json());
//app.use(express.static('public'));
//app.use('/',express.static(__dirname + 'public/'));
app.set('view engine', 'jade');

app.get('/', function (request, response) {
    response.sendFile(__dirname + '/public/home.html');
});

app.get('/login', function (request, response) {
    response.sendFile(__dirname + '/public/index.html');
});
//app.use('/static', express.static(__dirname + 'public/index.html'))

//app.get('/', function (req, res) {
//  res.render(../public/index.html, {});
//});

/*
 * Use express to handle argument passing in the URL.  This .get will cause express
 * /test/info - Return the SchemaInfo object of the database in JSON format. This
 *                       is good for testing connectivity with  MongoDB.
 */
app.get('/test/info', function (request, response) {
    // Express parses the ":p1" from the URL and returns it in the request.params objects.
    console.log('/test/info called');

    // Fetch the SchemaInfo. There should only one of them. The query of {} will match it.
    SchemaInfo.find({}, function (err, info) {
        if (err) {
            // Query returned an error.  We pass it back to the browser with an Internal Service
            // Error (500) error code.
            console.error('Doing /user/info error:', err);
            response.status(500).send(JSON.stringify(err));
            return;
        }
        if (info.length === 0) {
            // Query didn't return an error but didn't find the SchemaInfo object - This
            // is also an internal error return.
            response.status(500).send('Missing SchemaInfo');
            return;
        }

        // We got the object - return it in JSON format.
        response.send(JSON.stringify(info[0]));
    });

});

const buildingsRouter = require('./routers/buildingsRouter');
app.use('/buildings', buildingsRouter);

const sensorDataRouter = require('./routers/sensorDataRouter');
app.use('/sensorData', sensorDataRouter);

const occupancyDataRouter = require('./routers/occupancyDataRouter');
app.use('/occupancyData', occupancyDataRouter);

const adminControls = require('./routers/adminControls');
app.use('/admin', adminControls);

app.listen(PORT, () => {
  console.log(`Server listening at port ${PORT}.`);
});
