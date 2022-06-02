const MqttHandler = require('./mqttHandler');

const mqttClient = new MqttHandler();

mqttClient.connect();

module.exports = mqttClient;
