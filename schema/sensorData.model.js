const mongoose = require('mongoose')

const sensorTypes = ["Occupancy", "CO2", "Temperature"]

const dataReadingSchema = new mongoose.Schema({
    time: Date,
    data: Number
});

// Schema storing sensor data for one day for one sensor
const sensorDataSchema = new mongoose.Schema({
    room_id: {
        type: mongoose.Schema.Types.ObjectID,
        required: true
    },
    sensor_type: {
        type: String,
        enum: sensorTypes,
        require: true
    },
    date: {
        type: Date,
        required: true
    },
    readings: [dataReadingSchema]
});

module.exports = mongoose.model('SensorData', sensorDataSchema)
