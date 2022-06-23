const router = require("express").Router();
const { Op } = require("sequelize");
const db = require("../models");
const validate = require("./userValidation");
const MqttHandler = require("../../mqtt/mqttHandler");

const Location = db.location;
const Device = db.device;
const User = db.user;
const Case = db.case;

router.get("/dashboard", validate, async (req, res) => {
  // console.log(req.user);
  res.render("pages/home", {
    user: req.user,
  });
});

router.get("/dashboard/getdevices", validate, async (req, res) => {
  await Device.findAll({
    where: { user_id: req.user.id },
  }).then((data) => {
    res.send(data);
  });
});

router.get("/dashboard/:deviceID/data", validate, async (req, res) => {
  const locations = await Location.findAll({
    where: { device_imei: req.params.deviceID },
    raw: true,
  });

  const array = locations.reverse().slice(0, 50);
  res.send(array);
});

router.get("/dashboard/:deviceID", validate, async (req, res) => {
  await Device.findOne({
    where: { imei: req.params.deviceID, user_id: req.user.id },
  })
    .then((data) => {
      if (data == null) {
        const err = new Error("Device not found");
        err.code = 404;
        throw err;
      }

      res.render("pages/userdash", {
        deviceID: req.params.deviceID,
        licensePlate: String(data.licensePlate),
        mode: data.mode,
        user: req.user,
      });
    })
    .catch((err) => {
      res.status(err.code).send(err.message);
    });
});

router.get("/dashboard/:deviceID/status", validate, async (req, res) => {
  await Device.findOne({
    where: { imei: req.params.deviceID, user_id: req.user.id },
  })
    .then((data) => {
      if (data == null) {
        const err = new Error("Device not found");
        err.code = 404;
        throw err;
      }
      res.render("pages/status", {
        deviceID: req.params.deviceID,
        mode: data.mode,
        user: req.user,
      });
    })
    .catch((err) => {
      res.status(err.code).send(err.message);
    });
});

router.post("/dashboard/:deviceID/status", validate, async (req, res) => {
  const topic = `action/${req.params.deviceID}`;
  // console.log(topic);
  const mqttUpdate = new MqttHandler("mode-update");
  mqttUpdate.connect();
  mqttUpdate.sendMessage(req.body, topic);
  // console.log(req.body.action);

  await Device.findOne({ where: { imei: req.params.deviceID } }).then(
    async (device) => {
      device.set({
        mode: req.body.action,
      });
      await device.save().then(() => {
        // console.log(data);
        res.send("OK");
      });
    },
  );
});

router.get("/pairing", validate, (req, res) => {
  res.render("pages/pairing");
});

router.post("/pairing", validate, async (req, res) => {
  await Device.findOne({
    where: {
      imei: req.body.deviceID,
    },
  })
    .then(async (data) => {
      if (data == null) {
        const err = new Error("Device not found");
        err.code = 404;
        throw err;
      }
      if (data.user_id !== null) {
        // eslint-disable-next-line no-throw-literal
        const err = new Error("Device already paired");
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
      data.color = req.body.color;
      data.save();
      res.send(data);
    })
    .catch((err) => {
      res.send(err.message);
    });
});

router.post("/dashboard/:deviceID/report", validate, async (req, res) => {
  const device = await Device.findOne({
    where: { imei: req.params.deviceID, user_id: req.user.id },
  });

  await Case.findOne({
    where: {
      device_id: req.params.deviceID,
      status: {
        [Op.not]: 2,
      },
    },
  })
    .then(async (data) => {
      // console.log(data);
      if (data !== null) {
        // console.log('Case exist');
        const err = new Error(
          "There is already an ongoing case for this vehicle.",
        );
        err.code = 400;
        throw err;
      } else {
        // console.log('No case');
        const newCase = await Case.create({
          ownerName: req.user.name,
          licensePlate: device.licensePlate,
          vehicleName: device.vehicleName,
          color: device.color,
        });

        newCase.setDevice(device);

        res.send(newCase);
      }
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

router.get("/profile", validate, async (req, res) => {
  await User.findOne({
    where: {
      id: req.user.id,
    },
  }).then((data) => {
    res.render("pages/profile", { user: data });
  });
});

module.exports = router;
