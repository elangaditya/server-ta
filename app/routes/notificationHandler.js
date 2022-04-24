const router = require('express').Router();
const webpush = require('web-push');
const validate = require('./tokenValidation');
const db = require('../models');

const Subscription = db.subscription;
const User = db.user;

const privateKey = 'O-fMSyBoXZRvoS391CW5c-0sSCNR22JwRPMBZKw3_3M';
const publicKey = 'BG3LYBrcCZRQJyH9CfuVjteXWjCrCGBXDC9w8C0hQ9FwGBzcaBejAAcnsKwG-KCwdo5tz2kV62k4nh3B5hIgr0Q';

webpush.setVapidDetails('mailto:elang@google.com', publicKey, privateKey);

router.get('/subscribe', validate, (req, res) => {
    res.render('pages/notif', { user: req.user });
});

router.post('/subscribe', validate, async (req, res) => {
    // get push subscription object from the request
    await Subscription.create({
        endpoint: req.body.endpoint,
        p256dh: req.body.keys.p256dh,
        key: req.body.keys.auth,
    }).then(async (data) => {
        res.status(201).json({});

        await User.findOne({ where: { id: req.user.id } })
            .then((user) => {
                data.setUser(user);
            });

        const subscription = {
            endpoint: data.endpoint,
            keys: {
                p256dh: data.p256dh,
                auth: data.auth,
            },
        };

        // create paylod: specified the detals of the push notification
        const payload = JSON.stringify({ title: 'Section.io Push Notification' });
        console.log(subscription);

        // pass the object into sendNotification fucntion and catch any error
        webpush.sendNotification(subscription, payload).catch((err) => console.error(err));
    });
});

router.post('/testpush', (req) => {
    const subscription = {
        endpoint: req.body.endpoint,
        keys: {
            p256dh: req.body.p256dh,
            auth: req.body.auth,
        },
    };

    const message = {
        title: req.body.title,
        body: req.body.body,
    };

    webpush.sendNotification(subscription, JSON.stringify(message)).catch((err) => {
        console.error(err);
    });
});

module.exports = router;
