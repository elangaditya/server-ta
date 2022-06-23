const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../models");
const { confirmationMail } = require("./mailHandler");

const User = db.user;

const { registerValidation, loginValidation } = require("./validation");

// REGISTER ROUTE
router.get("/register", (req, res) => {
  res.render("pages/register");
});

router.post("/register", async (req, res) => {
  // Validation
  const { error } = registerValidation(req.body);
  if (error) return res.send(error.details[0].message);

  // Pre-exist check
  const emailExist = await User.findOne({ where: { email: req.body.email } });
  if (emailExist) return res.send("Email already registered");

  // Hashing
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  // Save
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });

  try {
    const savedUser = await user.save();
    // confirmationMail(savedUser);
    res.send(savedUser);
  } catch (err) {
    res.status(400).send(err);
  }
});

// LOGIN ROUTE
router.get("/login", (req, res) => {
  res.render("pages/login");
});

router.post("/login", async (req, res) => {
  // Validation
  const { error } = loginValidation(req.body);
  if (error) return res.send(error.details[0].message);

  // Email Check
  const user = await User.findOne({ where: { email: req.body.email } });
  if (!user) return res.send("Invalid email or password");

  // Password Compare
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.send("Invalid email or password");

  // Auth-token
  const token = jwt.sign(
    { id: user.id, name: user.name },
    process.env.TOKEN_SECRET,
    {
      expiresIn: "6h",
    },
  );
  res
    .cookie("auth_token", token, {
      httpOnly: true,
      secure: false,
    })
    .send(token);
});

router.get("/logout", (req, res) => {
  res.clearCookie("auth_token").redirect("/auth/login");
});

// EMAIL CONFIRMATION ROUTE
router.get("/:token", async (req, res) => {
  const verified = jwt.verify(req.params.token, process.env.TOKEN_EMAIL);
  // res.send(verified);
  const user = await User.findByPk(verified.id);
  user.validated = true;
  await user.save();

  res.send(user);
});

module.exports = router;
