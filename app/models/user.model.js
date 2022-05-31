module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('User', {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
        },
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
        // validated: {
        //     type: Sequelize.BOOLEAN,
        //     defaultValue: false,
        // },
    });

    return User;
};
