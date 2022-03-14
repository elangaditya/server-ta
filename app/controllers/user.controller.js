const db = require("../models");
const User = db.user;
const Op = db.Sequelize.Op;

// Create and Save a new Tutorial
exports.create = (object, res) => {
    // Validate object
    if (!object) {
        res.status(400).send({
            message: "Content can not be empty!",
        });
        return;
    }

    

    const user = {
        email : object.email,
        password : object.password
    };

    User.create(user)
        .then((data) => {
            console.log(user);
        })
        .catch((err) => {
            console.log("Data creation error")
        });
}
