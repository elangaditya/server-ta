const router = require('express').Router();
const db = require('../models');
const validate = require('./tokenValidation');
const MqttHandler = require('../../mqtt/mqttHandler');

const Location = db.location;
const Device = db.device;
// const jwt = require('jsonwebtoken');

router.get('/home', validate, async (req, res) => {
    console.log(req.user);
    res.render('pages/home', {
        user: req.user,
    });
});

router.get('/dashboard/:deviceID/data', validate, async (req, res) => {
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

router.get('/dashboard/:deviceID', validate, async (req, res) => {
    await Device.findOne({
        where: { imei: req.params.deviceID },
    }).then((data) => {
        res.render('pages/userdash', {
            deviceID: req.params.deviceID,
            mode: data.mode,
            user: req.user,
        });
    })
    .catch(() => {
        res.status(404).send('Device not found');
    });
});

router.get('/dashboard/:deviceID/status', validate, async (req, res) => {
    await Device.findOne({
        where: { imei: req.params.deviceID },
    }).then((data) => {
        res.render('pages/status', {
            deviceID: req.params.deviceID,
            mode: data.mode,
            user: req.user,
        });
    });
});

router.post('/dashboard/:deviceID/status', async (req) => {
    const topic = `action/${req.params.deviceID}`;
    console.log(topic);
    const mqttUpdate = new MqttHandler('mode-update');
    mqttUpdate.connect();
    mqttUpdate.sendMessage(req.body, topic);

    Device.update(
        { mode: req.body.actions },
        { where: { imei: req.params.deviceID } },
    );
});

module.exports = router;