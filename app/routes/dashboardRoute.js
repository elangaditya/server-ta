const router = require('express').Router();
const db = require('../models');
const validate = require('./tokenValidation');

const Location = db.location;
const Device = db.device;
// const jwt = require('jsonwebtoken');

router.get('/home', validate, async (req, res) => {
    console.log(req.user);
    res.render('pages/home', {
        user: req.user,
    });
});

router.get('/dashboard/:deviceID/data', async (req, res) => {
    const locations = await Location.findAll({
        where: { device_imei: req.params.deviceID },
        raw: true,
    });

    const array = locations.reverse().slice(0, 50);
    res.send(array);
    // .then((locations) => {
    //     console.log(locations)
    //     res.render('pages/userdash', {locations: locations})
    // })
});

router.get('/dashboard/:deviceID', async (req, res) => {
    await Device.findOne({
        where: { imei: req.params.deviceID },
    }).then(() => {
        res.render('pages/userdash', {
            deviceID: req.params.deviceID,
        });
    });
});

module.exports = router;