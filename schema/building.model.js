const mongoose = require('mongoose')

const roomSchema = mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectID,
        required: true,
        auto: true
    },
    name: {
        type: String,
        required: true
    },
    location: {
        x: Number,
        y: Number,
        width: Number,
        height: Number
    },
});

const floorSchema = mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectID,
        required: true,
        auto: true
    },
    name: {
        type: String,
        required: true
    },
    img_url: {
        type: String,
        required: true,
    },
    rooms: [roomSchema]
})

const buildingSchema = mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectID,
        required: true,
        auto: true
    },
    user_id: mongoose.Schema.Types.ObjectID, // The ID of the user assigned to the sensor.
    name: {
        type: String,
        required: true
    },
    floors: [floorSchema]
})

module.exports = mongoose.model('Building', buildingSchema)