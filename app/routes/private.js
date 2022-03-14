const router = require('express').Router();
const validate = require('./tokenValidation');

router.get('/', validate, (req, res) => {
    res.send(req.user);
});

module.exports = router;
