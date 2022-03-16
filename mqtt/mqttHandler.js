const mqtt = require('mqtt');
const { locationHandler } = require('./messageHandler');

class MqttHandler {
    constructor(id) {
        this.mqttClient = null;
        this.host = 'mqtt://128.199.77.62';
        this.topic = 'device/#';
        this.clientId = id;
    }

    connect() {
        this.mqttClient = mqtt.connect(this.host, {
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

    sendMessage(message, topic) {
        console.log(`sending: ${JSON.stringify(message)} \nto: ${topic}`);
        this.mqttClient.publish(topic, JSON.stringify(message), {
            qos: 0, retain: false,
        });
        // this.mqttClient.end();
    }
}

module.exports = MqttHandler;