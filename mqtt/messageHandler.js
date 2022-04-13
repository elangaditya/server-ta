const db = require('../app/models');

const Location = db.location;
const Device = db.device;

const locationHandler = async (topic, payload) => {
    console.log('Topic: ', topic);
    console.log('Received Message:', payload.toString());
    const topicArray = topic.split('/');
    await Device.findOrCreate({
        where: { imei: topicArray[1] },
    });

    const { eventName } = JSON.parse(payload);
    if (eventName === 'TrackerData') {
        const locationData = JSON.parse(payload);
        // eslint-disable-next-line prefer-destructuring
        locationData.device_imei = topicArray[1];
        const location = await Location.create(locationData);

        Device.update(
            { mode: locationData.mode },
            { where: { imei: topicArray[1] } },
        );

        try {
            location.save();
        } catch (err) {
            console.log('Error');
        }
    }
};

module.exports = { locationHandler };