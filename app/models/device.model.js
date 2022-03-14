module.exports = (sequelize, Sequelize) => {
    const Device = sequelize.define("Device", {
        vehicleName: {
            type: Sequelize.STRING,
        },
        mode: {
            type: Sequelize.STRING,
        },
        imei: {
            type: Sequelize.STRING,
        }
    });

    return Device;
};
