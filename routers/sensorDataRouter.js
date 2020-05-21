const express = require('express');
const router = express.Router();
const SensorData = require('../schema/sensorData.model');
const ObjectId = require('mongoose').Types.ObjectId;

router.get('/:id', (req, res)=>{
    let id = req.params.id;
    let user_id = req.session.user_id; // will be used to find user-specific data

    console.log("Servicing get request for sensorData with id ", id);

    try {
        SensorData.findOne({_id: id}, function(err, sensorData) {
            if (err) {
                // Query returned an error
                console.error('Fetching sensorData yielded error:', err);
                res.status(400).send(JSON.stringify(err));
                return;
            }
            if (sensorData === null) {
                // Query didn't return anything
                console.log('SensorData with _id:' + id + ' not found.');
                res.status(400).send('Not found');
                return;
            }

            // We got it
            console.log('User id', sensorData);
            res.send({
                "sensorData": sensorData
            });
        });
    } catch (err) {
        console.error('Fetching sensorData yielded error:', err);
        res.status(400).send(JSON.stringify(err));
    }
});

// Create one sensorData entry
router.post('/', (req, res) => {
    let {sensor_id, date, readings} = req.body;
    let user_id = req.session.user_id; // will be used to find user-specific data

    if(!ObjectId.isValid(sensor_id)){
        res.status(400).json({
            status: "failure",
            message: "Could not create sensorData document. Sensor_id is not a valid ID"
        })
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

    const sensorData = SensorData(req.body);

    try {
        sensorData.save((err, result) => {
            if(err){
                res.status(400).json({ message: err.message })
                return;
            }else {
                res.status(201).json({ message: "Sensor data created successfully", sensorData: result})
                return;
            }
        })
    } catch (err) {
        res.status(400).json({ message: err.message })
        return;
    }
});

module.exports = router