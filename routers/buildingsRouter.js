const express = require('express');
const router = express.Router();
const Building = require('../schema/building.model');

//TODO: filter for those buildings that the user has access for
//pending on user authentication being built
router.get('/', (req, res) => {
    let user_id = req.session.user_id; // will be used to find user-specific data

    try{
        Building.find({user_id: user_id}, (err, buildings) => {
            if(err){
                console.error('fetching Buildings yielded error: ', err);
                res.status(400).send(JSON.stringify((err)));
                return;
            }
            res.send({
                buildings: buildings
            })

        })
    } catch (err) {
        console.error('Fetching buildings yielded error:', err);
        res.status(400).send(JSON.stringify(err));
    }
});

router.patch('/:id', (req,res) => {
    let id = req.params.id;
    let user_id = req.session.user_id; // will be used to find user-specific data

    console.log("Servicing patch request for building with id ", id);
    try {
        Building.updateOne({_id: id, user_id: user_id}, { $set: req.body }, function(err, building) {
            if (err) {
                console.error('Updating building with id ', id, " yielded error");
                res.status(400).send(JSON.stringify(err));
                return;
            }

            console.log("Updated 1 building with id ", id);
            res.send({
               "updated_building" : building
            });
        });
    } catch (err) {
        console.error('Updating building yielded error:', err);
        res.status(400).send(JSON.stringify(err));
    }
});

router.get('/:id', (req, res)=>{
    let id = req.params.id;
    let user_id = req.session.user_id; // will be used to find user-specific data
    console.log("Servicing get request for building with id ", id);

    try {
        Building.findOne({_id: id, user_id: user_id}, function(err, building) {
            if (err) {
                // Query returned an error
                console.error('Fetching building yielded error:', err);
                res.status(400).send(JSON.stringify(err));
                return;
            }
            if (building === null) {
                // Query didn't return anything
                console.log('Building with _id:' + id + ' not found.');
                res.status(400).send('Not found');
                return;
            }

            // We got it
            console.log('User id', building);
            res.send({
                "building": building
            });
        });
    } catch (err) {
        console.error('Fetching building yielded error:', err);
        res.status(400).send(JSON.stringify(err));
    }
});

// Create one building
router.post('/', (req, res) => {
    const building = Building(req.body);
    let user_id = req.session.user_id; // will be used to find user-specific data
    building.user_id = user_id;

    try {
        building.save((err, result) => {
            if(err){
                res.status(400).json({ message: err.message })
                return;
            }else {
                res.status(201).json({ message: "Building created successfully", building: result})
                return;
            }
        })
    } catch (err) {
        res.status(400).json({ message: err.message })
        return;
    }
});

module.exports = router