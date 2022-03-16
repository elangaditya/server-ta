const mqtt = require('mqtt');
const { locationHandler } = require('./messageHandler');

class MqttHandler {
    constructor() {
        this.mqttClient = null;
        this.host = 'mqtt://128.199.77.62';
        this.clientId = 'mqtt_backend_server';
        this.topic = ['device/#'];
    }

    connect() {
        this.mqttClient = mqtt.connect(this.host, {
            clientId: this.clientId,
            port: 1883,
            clean: true,
            connectTimeout: 4000,
            reconnectPeriod: 1000,
        });

        this.mqttClient.on('connect', () => {
            console.log('Connected');
            this.mqttClient.subscribe(this.topic, () => {
              console.log(`Subscribe to topic '${this.topic}'`);
            });
        });

        this.mqttClient.on('message', locationHandler);
    }
}

module.exports = MqttHandler;