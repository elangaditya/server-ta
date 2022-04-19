const mqtt = require('mqtt');
const fs = require('fs');

const caFile = fs.readFileSync('./cert/chain.pem');
const certFile = fs.readFileSync('./cert/cert.pem');
const keyFile = fs.readFileSync('./cert/key.pem');

const { locationHandler } = require('./messageHandler');

class MqttHandler {
    constructor(id) {
        this.mqttClient = null;
        this.host = 'mqtts://188.166.244.185';
        this.topic = 'device/#';
        this.clientId = id;
    }

    connect() {
        this.mqttClient = mqtt.connect(this.host, {
            port: 8883,
            clean: true,
            connectTimeout: 4000,
            reconnectPeriod: 1000,
            username: 'mqttbrokerkel8',
            password: 'secret_mqttbroker_pass',
            rejectUnauthorized: false,
            ca: caFile,
            cert: certFile,
            key: keyFile,
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