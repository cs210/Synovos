const mongoose = require('mongoose')

const dataReadingSchema = new mongoose.Schema({
    time: Date,
    data: Number
});

// Schema storing sensor data for one day for one sensor
const sensorDataSchema = new mongoose.Schema({
    sensor_id: {
        type: mongoose.Schema.Types.ObjectID,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    readings: [dataReadingSchema]
});

module.exports = mongoose.model('SensorData', sensorDataSchema)