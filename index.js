/* eslint-disable prefer-destructuring */
/* eslint-disable no-shadow */
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

dotenv.config();

// eslint-disable-next-line no-unused-vars
const path = require('path');

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
// eslint-disable-next-line no-unused-vars
const db = require('./app/models');

db.sequelize.sync({ force: true });

// Public
app.use(express.static('public'));

// Import Routes
const authRoute = require('./app/routes/userAuth');
const dashRoute = require('./app/routes/dashboardRoute');
const notifRoute = require('./app/routes/notificationHandler');
const policeAuth = require('./app/routes/policeAuth');
const policeDashboard = require('./app/routes/policeDashboard');

// Routing
app.get('/', (req, res) => {
  res.redirect('/auth/login');
});
app.use('/auth', authRoute);
app.use('/police/auth', policeAuth);
app.use('/police/api', policeDashboard);
app.use('/api', dashRoute);
app.use('/notification', notifRoute);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  // console.log(`Server is running on port ${PORT}.`);
});

// MQTT
// eslint-disable-next-line no-unused-vars
const mqttClient = require('./mqtt/mqttClient');
