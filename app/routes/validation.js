const Joi = require('joi');

const registerValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required(),
        password_confirm: Joi.string().required().valid(Joi.ref('password')).messages({ 'any.only': 'Passwords did not match' }),
    });

    return schema.validate(data);
};

const loginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required(),
    });

    return schema.validate(data);
};

module.exports = { registerValidation, loginValidation };
