const db = require("../models");
const Device = db.device;
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

    const device = {
        vehicleName: object.vehicleName,
        mode: object.mode
    };

    Device.create(device)
        .then((data) => {
            console.log(device);
        })
        .catch((err) => {
            console.log("Data creation error")
        });
}
