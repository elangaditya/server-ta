const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models');

const Police = db.police;

const { registerValidation, loginValidation } = require('./validation');

// REGISTER ROUTE
router.get('/register', (req, res) => {
  res.render('pages/registerpolice');
});

router.post('/register', async (req, res) => {
  // Validation
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Pre-exist check
  const emailExist = await Police.findOne({ where: { email: req.body.email } });
  if (emailExist) return res.status(409).send('Email already exist');

  // Hashing
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  // Save
  const police = await Police.create({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });

  try {
    await police.save();
    res.redirect('/police/auth/login');
  } catch (err) {
    res.status(400).send(err);
  }
});

// LOGIN ROUTE
router.get('/login', (req, res) => {
  res.render('pages/loginpolice');
});

router.post('/login', async (req, res) => {
  // Validation
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Email Check
  const police = await Police.findOne({ where: { email: req.body.email } });
  if (!police) return res.status(400).send('Email doesnt exist');

  // Password Compare
  const validPass = await bcrypt.compare(req.body.password, police.password);
  if (!validPass) return res.status(400).send('Invalid password');

  // Auth-token
  const token = jwt.sign({ id: police.id, name: police.name }, process.env.POLICE_TOKEN_SECRET, {
    expiresIn: '1h',
  });
  res.cookie('police_token', token, {
    httpOnly: true, secure: false,
  }).redirect('/police/api/home');
});

module.exports = router;
