module.exports = (sequelize, Sequelize) => {
    const Case = sequelize.define('Case', {
        vehicleName: {
            type: Sequelize.STRING,
        },
        licensePlate: {
            type: Sequelize.STRING,
        },
        status: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
        },
    });

    return Case;
};
