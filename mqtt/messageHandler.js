const db = require('../app/models');

const Location = db.location;
const Device = db.device;

const locationHandler = async (topic, payload) => {
    console.log('Topic: ', topic);
    console.log('Received Message:', payload.toString());
    const topicArray = topic.split('/');
    const device = await Device.findOrCreate({
        where: { imei: topicArray[1] },
    });
    console.log(device);

    const locationData = JSON.parse(payload);
    // eslint-disable-next-line prefer-destructuring
    locationData.device_imei = topicArray[1];
    const location = await Location.create(locationData);
    console.log(locationData);

    Device.update(
        { mode: locationData.mode },
        { where: { imei: topicArray[1] } },
    );

    try {
        const savedLocation = await location.save();
        console.log(savedLocation);
    } catch (err) {
        console.log('Error');
    }
};

module.exports = { locationHandler };