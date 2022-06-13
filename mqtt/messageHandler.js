/* eslint-disable operator-linebreak */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
const webpush = require("web-push");
const db = require("../app/models");

const privateKey = "O-fMSyBoXZRvoS391CW5c-0sSCNR22JwRPMBZKw3_3M";
const publicKey =
  "BG3LYBrcCZRQJyH9CfuVjteXWjCrCGBXDC9w8C0hQ9FwGBzcaBejAAcnsKwG-KCwdo5tz2kV62k4nh3B5hIgr0Q";

webpush.setVapidDetails("mailto:elang@google.com", publicKey, privateKey);

const Location = db.location;
const Device = db.device;
const User = db.user;
const Subscription = db.subscription;

const messageHandler = async (topic, payload) => {
  console.log("Topic: ", topic);
  console.log("Received Message:", payload.toString());
  const topicArray = topic.split("/");
  const deviceID = topicArray[1];

  await Device.findOrCreate({
    where: { imei: deviceID },
    raw: true,
  }).then(async (device) => {
    const { eventName } = JSON.parse(payload);
    if (eventName === "TrackerData") {
      const locationData = JSON.parse(payload);
      // eslint-disable-next-line prefer-destructuring
      locationData.device_imei = topicArray[1];
      const location = await Location.create(locationData);

      Device.update({ mode: locationData.mode }, { where: { imei: deviceID } });
    }

    if (eventName === "TriggerNotification") {
      // console.log(device);
      if (device.user_id !== null) {
        const subscription = await Subscription.findAll({
          where: { user_id: device[0].user_id },
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
            body: `Terdeteksi pergerakan pada kendaraan ${device[0].vehicleName} ${device[0].licensePlate}.`,
          };

          webpush
            .sendNotification(subData, JSON.stringify(message))
            .catch((err) => {
              console.error(err);
            });
        });
      }
    }
  });
};

module.exports = { messageHandler };
