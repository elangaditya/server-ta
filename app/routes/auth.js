const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models');

const User = db.user;

const { registerValidation, loginValidation } = require('./validation');
// const mail = require("./mail");
// const passport = require("passport");

// REGISTER ROUTE
router.get('/register', (req, res) => {
    res.render('pages/register');
});

router.post('/register', async (req, res) => {
    // Validation
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Pre-exist check
    const emailExist = await User.findOne({ where: { email: req.body.email } });
    if (emailExist) return res.status(409).send('Email already exist');

    // Hashing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Save
    const user = await User.create({
        email: req.body.email,
        password: hashedPassword,
    });

    try {
        await user.save();
        // console.log(savedUser);
        res.redirect('/auth/login');
    } catch (err) {
        res.status(400).send(err);
    }
});

// LOGIN ROUTE
router.get('/login', (req, res) => {
    res.render('pages/login');
});

router.post('/login', async (req, res) => {
    // Validation
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Email Check
    const user = await User.findOne({ where: { email: req.body.email } });
    if (!user) return res.status(400).send('Email doesnt exist');

    // Password Compare
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send('Invalid password');

    // Auth-token
    const token = jwt.sign({ id: user.id }, process.env.TOKEN_SECRET, {
        expiresIn: '1h',
    });
    res.header('auth-token', token).send(token);
});

// GOOGLE ROUTE
// router.get(
//     "/google",
//     passport.authenticate("google", {
//         scope: ["profile"],
//     })
// );

// EMAIL CONFIRMATION ROUTE
// router.get("/:token", async (req, res) => {
//     const verified = jwt.verify(req.params.token, process.env.TOKEN_EMAIL);
//     // res.send(verified);
//     const user = await User.findOne({ _id: verified._id });
//     user.activated = true;
//     await user.save();

//     res.send(user);
// });

module.exports = router;
