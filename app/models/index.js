const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: false,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle,
    },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.location = require("./location.model.js")(sequelize, Sequelize);
db.user = require("./user.model.js")(sequelize, Sequelize);
db.device = require("./device.model.js")(sequelize, Sequelize);

db.user.hasMany(db.device, {foreignKey: "user_id"})
db.device.belongsTo(db.user, {foreignKey: "user_id"})

// db.device.hasMany(db.location, {foreignKey: "device_id"})
// db.location.belongsTo(db.device, {foreignKey: "device_id"})

module.exports = db;
