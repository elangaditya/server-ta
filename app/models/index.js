const Sequelize = require('sequelize');
const dbConfig = require('../config/db.config');

// const options = {
//     host: dbConfig.HOST,
//     dialect: dbConfig.dialect,
//     dialectOptions: {
//         socketPath: dbConfig.HOST,
//     },
// };

// const devOptions = {
//     host: dbConfig.HOST,
//     dialect: dbConfig.dialect,
//     operatorsAliases: false,
//     pool: {
//         max: dbConfig.pool.max,
//         min: dbConfig.pool.min,
//         acquire: dbConfig.pool.acquire,
//         idle: dbConfig.pool.idle,
//     },
// };

// const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, devOptions);
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
db.subscription = require('./subscription.model')(sequelize, Sequelize);
db.case = require('./case.model')(sequelize, Sequelize);
db.police = require('./police.model')(sequelize, Sequelize);

db.user.hasMany(db.device, { foreignKey: 'user_id' });
db.device.belongsTo(db.user, { foreignKey: 'user_id' });

db.user.hasMany(db.subscription, { foreignKey: 'user_id' });
db.subscription.belongsTo(db.user, { foreignKey: 'user_id' });

db.device.hasMany(db.case, { foreignKey: 'device_id' });
db.case.belongsTo(db.device, { foreignKey: 'device_id' });

module.exports = db;
