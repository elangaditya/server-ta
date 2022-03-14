const db = require("../models");
const Location = db.location;
const Op = db.Sequelize.Op;

// Create and Save a new Tutorial
exports.create = (object, res) => {
    // Validate objectuest
    if (!object) {
        res.status(400).send({
            message: "Content can not be empty!",
        });
        return;
    }

    const location = {
        status: object.mode,
        latitude: object.lat,
        longitude: object.long,
        auth: object.auth
    };

    Location.create(location)
        .then((data) => {
            console.log(location);
        })
        .catch((err) => {
            console.log("Data creation error")
        });
}
