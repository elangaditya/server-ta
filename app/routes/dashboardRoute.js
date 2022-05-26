const router = require('express').Router();
const db = require('../models');
const validate = require('./userValidation');
const MqttHandler = require('../../mqtt/mqttHandler');

const Location = db.location;
const Device = db.device;
const User = db.user;
const Case = db.case;

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
});

router.get('/dashboard/:deviceID', validate, async (req, res) => {
    await Device.findOne({
        where: { imei: req.params.deviceID, user_id: req.user.id },
    }).then((data) => {
        if (data == null) {
            const err = new Error('Device not found');
            err.code = 404;
            throw err;
        }

        res.render('pages/userdash', {
            deviceID: req.params.deviceID,
            mode: data.mode,
            user: req.user,
        });
    })
    .catch((err) => {
        res.status(err.code).send(err.message);
    });
});

router.get('/dashboard/:deviceID/status', validate, async (req, res) => {
    await Device.findOne({
        where: { imei: req.params.deviceID, user_id: req.user.id },
    }).then((data) => {
        if (data == null) {
            const err = new Error('Device not found');
            err.code = 404;
            throw err;
        }
        res.render('pages/status', {
            deviceID: req.params.deviceID,
            mode: data.mode,
            user: req.user,
        });
    }).catch((err) => {
        res.status(err.code).send(err.message);
    });
});

router.post('/dashboard/:deviceID/status', async (req, res) => {
    const topic = `action/${req.params.deviceID}`;
    console.log(topic);
    const mqttUpdate = new MqttHandler('mode-update');
    mqttUpdate.connect();
    mqttUpdate.sendMessage(req.body, topic);

    const device = await Device.update(
        { mode: req.body.action },
        { where: { imei: req.params.deviceID } },
    );
    res.send(device);
});

router.get('/pairing', (req, res) => {
    res.render('pages/pairing');
});

router.post('/pairing', validate, async (req, res) => {
    await Device.findOne({
        where: {
            imei: req.body.deviceID,
        },
    }).then(async (data) => {
        if (data == null) {
            const err = new Error('Device not found');
            err.code = 404;
            throw err;
        }
        if (data.user_id !== null) {
            // eslint-disable-next-line no-throw-literal
            const err = new Error('Device already paired');
            err.code = 406;
            throw err;
        }
        const user = await User.findOne({
            where: {
                id: req.user.id,
            },
        });
        data.setUser(user);
        data.vehicleName = req.body.vehicleName;
        data.licensePlate = req.body.licensePlate;
        data.save();
        res.send(data);
    }).catch((err) => {
        res.status(err.code).send(err.message);
    });
});

router.post('/dashboard/:deviceID/report', validate, async (req, res) => {
    const device = await Device.findOne({
        where: { imei: req.params.deviceID, user_id: req.user.id },
    });
    
    const newCase = await Case.create({
        licensePlate: device.licensePlate,
        vehicleName: device.vehicleName,
    });


    newCase.setDevice(device);
    res.send(newCase);
});

module.exports = router;