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

// Load the Mongoose schema for SchemaInfo, User
var SchemaInfo = require('./schema/schemaInfo.js');
var User = require('./schema/user.js');

// We use ExpressJS as a MiddleWare
var express = require('express');
var app = express();
app.use(express.json())

var session = require('express-session');

// We have the express static module (http://expressjs.com/en/starter/static-files.html) do all
// the work for us.
//app.use(express.static(__dirname));

// Import functions from hashpasswords.js to hash passwords
var encryption = require('./modelData/hashpasswords.js');

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
//app.use(bodyParser.json());
app.use(express.static(__dirname));


//app.get('/', function (request, response) {
//    response.send(index.jsx);
//});

app.get('/', function (req, res) {
  res.render('index', {});
});

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
app.use('/buildings', buildingsRouter)

const sensorDataRouter = require('./routers/sensorDataRouter');
app.use('/sensorData', sensorDataRouter)

const occupancyDataRouter = require('./routers/occupancyDataRouter');
app.use('/occupancyData', occupancyDataRouter)


/*
 * /admin/login - Change the login state
 * Find user in database and create session in the backend with (request.session)
 */
app.post('/admin/login', function (request, response) {
    User.findOne({login_name: request.body.login_name} , function (err, info) {
        if (err) {
            console.error('Doing /admin/login with error: ', err);
            response.status(500).send(JSON.stringify(err));
            return;
        }
        if (!info) {
            console.log('Login name ' + request.body.login_name + ' not found.');
            response.status(400).send('Not found');
            return;
        }

        if (encryption.doesPasswordMatch(info.password_digest, info.salt, request.body.password) === false) {
            console.log('Wrong password.');
            response.status(400).send('Passwords dont match!');
            return;
        }

        // Storing login name & user id in the session that is only available in the backend
        request.session.login_name = request.body.login_name;
        request.session.user_id = info._id;
        response.status(200).send(info);
    });
});


/*
 * URL /admin/logout - Change the login state to logout and destroy all session
 */
app.post('/admin/logout', function(request, response){
    // Check if there is a session -- User logged in
    if (!request.session.login_name){
        console.log('User not logged in');
        response.status(401).send('Unauthorized');
        return;
    }

    // Remove references with “delete”, then call request.session.destroy(callback)
    delete request.session.login_name;
    delete request.session.user_id;

    request.session.destroy(function(err) {
        if(err){
            console.log('Doing /admin/logout with error:', err);
            response.status(500).send(JSON.stringify(err));
            return;
        }
        response.status(200).send("Session Deleted, User Logout completed");
    });
});

/*
 * URL /user - Create a new User
 */
app.post('/user', function(request, response){
    // Check if login_name exists
    if(!request.body.login_name){
        console.log('Login name required');
        response.status(400).send('Login name required');
        return;
    }

    // Try to find login_name. If it already exists, throw an error.
    User.findOne({login_name: request.body.login_name} , function (err, info) {
        if (err) {
            // Query returned an error.  We pass it back to the browser with an Internal Service
            // Error (500) error code.
            console.error('Doing /user with error: ', err);
            response.status(500).send(JSON.stringify(err));
            return;
        }

        if(info){
            console.log('Login name ' + request.body.login_name + ' not found.');
            response.status(400).send('Login name not found');
            return;
        }

        // only if user with specified login_name not found, create a new user
        if(!request.body.password){
            console.log('Password required');
            response.status(400).send('Password not found');
            return;
        }
        if(!request.body.first_name){
            console.log('First name required');
            response.status(400).send('First name not found');
            return;
        }
        if(!request.body.last_name){
            console.log('Last name required');
            response.status(400).send('Last name not found');
            return;
        }

        // Create passwords
        var passwordEntry = encryption.makePasswordEntry(request.body.password);

        // create user
        User.create({
            login_name: request.body.login_name,
            first_name: request.body.first_name,
            last_name: request.body.last_name,
            password_digest: passwordEntry.hash,
            salt: passwordEntry.salt,
        }).then( function (userObj) {
            userObj.save();
            console.log('Adding User:', userObj.login_name, ' of user ID ', userObj._id);

            request.session.login_name = userObj.login_name;
            request.session.user_id = userObj._id;

            response.status(200).send(userObj);
            return;

        }).catch(function (err){
            console.error('Error create User', err);
            response.status(400).send(JSON.stringify(err));
            return;
        });
    });
});

app.listen(PORT, () => {
  console.log(`Server listening at port ${PORT}.`);
});
