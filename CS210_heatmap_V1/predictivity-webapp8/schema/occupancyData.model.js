const mongoose = require('mongoose')

const dataReadingSchema = new mongoose.Schema({
    time: Date,
    data: Number
});

// Schema storing sensor data for one day for one sensor
const occupancyDataSchema = new mongoose.Schema({
    room_id: {
        type: mongoose.Schema.Types.ObjectID,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    readings: [dataReadingSchema]
});

module.exports = mongoose.model('OccupancyData', occupancyDataSchema)