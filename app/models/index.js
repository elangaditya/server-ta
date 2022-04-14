const Sequelize = require('sequelize');
const dbConfig = require('../config/db.config');

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    dialectOptions: {
        socketPath: process.env.DB_HOST,
    },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.location = require('./location.model')(sequelize, Sequelize);
db.user = require('./user.model')(sequelize, Sequelize);
db.device = require('./device.model')(sequelize, Sequelize);

db.user.hasMany(db.device, { foreignKey: 'user_id' });
db.device.belongsTo(db.user, { foreignKey: 'user_id' });

module.exports = db;
