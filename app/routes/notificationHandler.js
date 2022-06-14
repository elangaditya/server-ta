const router = require("express").Router();
const webpush = require("web-push");
const validate = require("./userValidation");
const db = require("../models");

const Subscription = db.subscription;
const User = db.user;

const privateKey = "O-fMSyBoXZRvoS391CW5c-0sSCNR22JwRPMBZKw3_3M";
const publicKey =
  "BG3LYBrcCZRQJyH9CfuVjteXWjCrCGBXDC9w8C0hQ9FwGBzcaBejAAcnsKwG-KCwdo5tz2kV62k4nh3B5hIgr0Q";

webpush.setVapidDetails("mailto:elang@google.com", publicKey, privateKey);

router.get("/subscribe", validate, (req, res) => {
  res.render("pages/notif", { user: req.user });
});

router.post("/subscribe", validate, async (req, res) => {
  // get push subscription object from the request
  // console.log(req.body);
  const { endpoint } = req.body;
  const { p256dh } = req.body.keys;
  const { auth } = req.body.keys;
  await Subscription.create({
    endpoint,
    p256dh,
    auth,
  }).then(async (data) => {
    res.status(201).json({});

    await User.findOne({ where: { id: req.user.id } }).then((user) => {
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
    const payload = JSON.stringify({ title: "Push Notification" });
    // console.log(subscription);

    // pass the object into sendNotification fucntion and catch any error
    // eslint-disable-next-line no-console
    webpush
      .sendNotification(subscription, payload)
      .catch((err) => console.error(err));
  });
});

router.post("/testpush", async (req) => {
  const subscription = await Subscription.findAll({
    where: { user_id: req.body.user_id },
  });
  subscription.forEach((data) => {
    const subData = {
      endpoint: data.endpoint,
      keys: {
        p256dh: data.p256dh,
        auth: data.auth,
      },
    };

    const message = {
      title: "Pergerakan Tidak Terautorisasi Terdeteksi",
      body: `Terdeteksi pergerakan pada kendaraan Toyota Avanza.`,
    };
    webpush.sendNotification(subData, JSON.stringify(message)).catch((err) => {
      console.error(err);
    });
  });
});

module.exports = router;
