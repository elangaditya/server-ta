const MqttHandler = require('./mqtt/mqttHandler');

const mqttClient = new MqttHandler();

mqttClient.connect();

module.exports = mqttClient;