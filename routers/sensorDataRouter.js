const express = require('express');
const router = express.Router();
const SensorData = require('../schema/sensorData.model');
const ObjectId = require('mongoose').Types.ObjectId;
const axios = require('axios')
const OCCUPANCY_ENDPOINT = 'https://5yyzvmal40.execute-api.us-west-2.amazonaws.com/prod/kmeans-prediction';

/**
 * params:
 * - room_ids: comma separated list of room_ids (can just send a single id)
 * - start_date: start date for the data query (should set hours, minutes, second and miliseconds to 0)
 * - end_date: end date for data query, not inclusive
 */
router.get('/', (req, res) => {
    // Check if there is a session -- User logged in
    if (!req.session.login_name){
        console.log('User not logged in');
        res.status(401).send('Unauthorized');
        return;
    }

    let user_id = req.session.user_id; // will be used to find user-specific data

    let { room_ids, start_date, end_date, sensor_type } = req.query;

    if(room_ids === '' || typeof room_ids !== "string"
        || isNaN(Date.parse(start_date))
        || isNaN(Date.parse(end_date))){
        res.status(400).json({
            status: "failure",
            message: "Invalid query. Need to provide room_ids, start_date and end_date for the query"
        });
        return;
    }
    let roomIdList = room_ids.split(',');
    try {
        SensorData.find({
            room_id: {
                $in: roomIdList
            },
            date: {
                $gte: new Date(start_date),
                $lt: new Date(end_date)
            },
            sensor_type: sensor_type
        }, function (err, occupancyData) {
            if (err) {
                // Query returned an error
                console.error('Fetching occupancyData yielded error:', err);
                res.status(400).send(JSON.stringify(err));
                return;
            }
            if (occupancyData === null) {
                // Query didn't return anything
                console.log('SensorData with room_ids ', room_ids, " returned null." );
                res.status(400).send('Not found');
                return;
            }

            // We got it
            console.log('Occupancy data', occupancyData);
            res.send({
                "occupancyData": occupancyData
            });
        });
    } catch(err) {
        console.error('Fetching occupancyData yielded error:', err);
        res.status(400).send(JSON.stringify(err));
    }

});

router.get('/:id', (req, res)=>{
    // Check if there is a session -- User logged in
    if (!req.session.login_name){
        console.log('User not logged in');
        res.status(401).send('Unauthorized');
        return;
    }

    let id = req.params.id;
    let user_id = req.session.user_id; // will be used to find user-specific data

    try {
        SensorData.findOne({_id: id}, function(err, occupancyData) {
            if (err) {
                // Query returned an error
                console.error('Fetching occupancyData yielded error:', err);
                res.status(400).send(JSON.stringify(err));
                return;
            }
            if (occupancyData === null) {
                // Query didn't return anything
                console.log('SensorData with _id:' + id + ' not found.');
                res.status(400).send('Not found');
                return;
            }

            // We got it
            console.log('User id', occupancyData);
            res.send({
                "occupancyData": occupancyData
            });
        });
    } catch (err) {
        console.error('Fetching occupancyData yielded error:', err);
        res.status(400).send(JSON.stringify(err));
    }
});

// Create one sensorData entry
router.post('/', (req, res) => {
    // Check if there is a session -- User logged in
    if (!req.session.login_name){
        console.log('User not logged in');
        res.status(401).send('Unauthorized');
        return;
    }

    let {room_id, date, readings} = req.body;
    let user_id = req.session.user_id; // will be used to find user-specific data

    if(!ObjectId.isValid(room_id)){
        res.status(400).json({
            status: "failure",
            message: "Could not create occupancyData document. Sensor_id is not a valid ID"
        });
        return;
    }

    //TODO: check if date is valid
    if(date ===undefined){
        res.status(400).json({
            status: "failure",
            message: "SensorData date is not valid"
        })
    }

    //TODO: validate readings

    const occData = SensorData(req.body);

    try {
        occData.save((err, result) => {
            if(err){
                res.status(400).json({ message: err.message })
                return;
            }else {
                res.status(201).json({ message: "SensorData created successfully", occupancyData: result})

                // Creating occupancy data
                if(occData.sensor_type == 'CO2'){
                    axios.post(OCCUPANCY_ENDPOINT, result).then((response) => {
                        if(response.data.statusCode == 200){
                            console.log('predicted occupancy successfully');
                            const occData = SensorData(response.data.body);
                            occData.save((err, result) => {
                               if(err){
                                   console.log("Couldn't save occupancy data")
                               } else{
                                   console.log("Saved occupancy data successfully with id ", result._id)
                               }
                            });
                        }
                    });
                }
                return;
            }
        })
    } catch (err) {
        res.status(400).json({ message: err.message })
        return;
    }
});

module.exports = router