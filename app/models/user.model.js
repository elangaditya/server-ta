module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('User', {
        name: {
            type: Sequelize.STRING,
        },
        email: {
            type: Sequelize.STRING,
            allowNulll: false,
            unique: true,
            validate: {
                isEmail: {
                    msg: 'Must be a valid email address.',
                },
            },
        },
        password: {
            type: Sequelize.STRING,
        },
        verified: {
            type: Sequelize.BOOLEAN,
            default: false,
        },
    });

    return User;
};
