const mongoose = require('mongoose')

const sensorSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectID,
        required: true,
        auto: true
    },
    sensorType: {
        type: String,
        required: true
    }
});

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
    pdf_loc: {
        x: String,
        y: String,
        w: String,
        h: String
    },
    sensors: [sensorSchema]
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
    name: {
        type: String,
        required: true
    },
    floors: [floorSchema]
})

module.exports = mongoose.model('Building', buildingSchema)