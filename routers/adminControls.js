const express = require('express');
const router = express.Router();
const User = require('../schema/user.js');
const Building = require('../schema/building.model');
const OccupancyData = require('../schema/sensorData.model');

const ObjectId = require('mongoose').Types.ObjectId;

var async = require('async');

var app = express();

// Use bodyParser for JSON
var bodyParser = require('body-parser');
app.use(bodyParser.json());

// Import functions from hashpasswords.js to hash passwords
var encryption = require('./hashpasswords.js');

var session = require('express-session');

// ExpressJS has a middleware layer for dealing with the session state
app.use(session({
    secret: 'secretKey',
    resave: false,
    saveUninitialized: false,
}));

//TODO: Change error messages
//TODO: Check for Post Requests if ObjectID is valid!

/*
 * /admin/login - Change the login state
 * Find user in database and create session in the backend with (request.session)
 */
router.post('/login', function (request, response) {
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
        console.log(request.session)
        response.status(200).send(info);
    });
});

/*
 * Delete all data associate with one account
 */
router.post('/delete', function(request, response){
    // Check if there is a session -- User logged in
    if (!request.session.login_name){
        console.log('User not logged in');
        response.status(401).send('Unauthorized');
        return;
    }

    console.log('delete user has been called');
    user_id = request.session.user_id;
    // Find Photo with the right id and ind insert the comment
    User.deleteOne({_id: user_id} , function (err, info) {
        if (err) {
            // Query returned an error.  We pass it back to the browser with an Internal Service
            // Error (500) error code.
            console.error('Doing /delete/ with error:', err);
            response.status(500).send(JSON.stringify(err));
            return;
        }
        if (!info) {
            console.log('User with id ' + user_id + ' not found.');
            response.status(400).send('Not found');
            return;
        }

        Building.find({user_id: user_id} , function (err, info) {
            if (err) {
                // Query returned an error.  We pass it back to the browser with an Internal Service
                // Error (500) error code.
                console.error('Doing /deleteUser/' + user_id + ' with error:', err);
                response.status(500).send(JSON.stringify(err));
                return;
            }

            var temp_building = JSON.parse(JSON.stringify(info));

            // OccupancyData.deleteMany is an asynchronous function. async each is basically a for (element in object)
            // loop that runs synchronously.
            // What this loop does: Finds all rooms and deletes associated OccupancyData.
            async.each(temp_building, function(building, done_callback) {
                async.each(building.floors, function(floor, done_callback) {
                    async.each(floor.rooms, function (room, done_callback) {
                        OccupancyData.deleteMany({room_id: room._id} , function (err, info) {
                            if (err) {
                                console.error('Doing /deleteUser/' + user_id + ' with error:', err);
                                response.status(500).send(JSON.stringify(err));
                                return;
                            }
                            console.log("Delete Occupancy")
                            console.log(info);
                            done_callback(err);
                        });
                    }, function (err) {
                        done_callback(err);
                    });
                }, function(err){
                    done_callback(err);
                });
            }, function(err){
                if (err) {
                    response.status(500).send(JSON.stringify(err));
                } else{
                    // One we delete all Occupancy data, we can delete all buildings associated with the user
                    // + the user themselves
                    Building.deleteMany({user_id: user_id} , function (err, info) {
                        if (err) {
                            // Query returned an error.  We pass it back to the browser with an Internal Service
                            // Error (500) error code.
                            console.error('Doing /deleteUser/' + user_id + ' with error:', err);
                            response.status(500).send(JSON.stringify(err));
                            return;
                        }

                        console.log("delete user model");
                        console.log(info);
                        response.status(200).send(true);
                    });
                }
            });
        });
    });
});

/*
 * URL /admin/logout - Change the login state to logout and destroy all session
 */
router.post('/logout', function(request, response){

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
router.post('/create', function(request, response){
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
            response.status(400).send('Login name not found or already in use');
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


module.exports = router