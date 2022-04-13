/* eslint-disable prefer-destructuring */
/* eslint-disable no-shadow */
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

dotenv.config();

// eslint-disable-next-line no-unused-vars
const path = require('path');

// MQTT Connect
// const mqtt = require('mqtt');

// const host = '128.199.77.62';
// const port = '1883';
// const clientId = 'mqtt_backend_server';

// const connectUrl = `mqtt://${host}:${port}`;
// const client = mqtt.connect(connectUrl, {
//   clientId,
//   clean: true,
//   connectTimeout: 4000,
//   reconnectPeriod: 1000,
// });

const app = express();
app.use(cookieParser());

const corsOptions = {
    origin: 'http://localhost:8081',
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// view engine
app.set('view engine', 'ejs');

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// database
const db = require('./app/models');

db.sequelize.sync({ force: true });

// Public
app.use(express.static('public'));

// Import Routes
const authRoute = require('./app/routes/auth');
const dashRoute = require('./app/routes/dashboardRoute');

// Routing
app.use('/auth', authRoute);
app.use('/api', dashRoute);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

// MQTT
// eslint-disable-next-line no-unused-vars
const mqttClient = require('./mqtt/mqttClient');
