module.exports = (sequelize, Sequelize) => {
    const Device = sequelize.define('Device', {
        imei: {
            type: Sequelize.STRING,
            primaryKey: true,
        },
        vehicleName: {
            type: Sequelize.STRING,
        },
        mode: {
            type: Sequelize.STRING,
        },
        licensePlate: {
            type: Sequelize.STRING,
        },
        color: {
            type: Sequelize.STRING,
        },
    });

    return Device;
};
