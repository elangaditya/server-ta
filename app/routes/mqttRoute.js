const mqtt = require('mqtt')
const host = '128.199.77.62'
const port = '1883'
const clientId = `mqtt_backend_server`

const connectUrl = `mqtt://${host}:${port}`
const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  reconnectPeriod: 1000,
})

const db = require('../models')
const Location = db.location
const Device = db.device

