module.exports = (sequelize, Sequelize) => {
    const Subscription = sequelize.define('Subscription', {
        endpoint: {
            type: Sequelize.STRING,
        },
        pd256h: {
            type: Sequelize.STRING,
        },
        auth: {
            type: Sequelize.STRING,
        },
    });

    return Subscription;
};
