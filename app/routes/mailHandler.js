const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

// async..await is not allowed in global scope, must use a wrapper
module.exports.confirmationMail = async function (user) {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.EMAIL_ADDRESS, // generated ethereal user
            pass: process.env.EMAIL_PASSWORD, // generated ethereal password
        },
    });
    console.log(user.id);
    const token = jwt.sign({ id: user.id }, process.env.TOKEN_EMAIL, {
        expiresIn: "1d",
    });

    // send mail with defined transport object
    let link = process.env.LINK_EMAIL + `auth/${token}`;
    let info = await transporter.sendMail({
        to: user.email, // list of receivers
        subject: "Konfirmasi Email", // Subject line
        text: `Untuk mengkonfirmasi Email klik link berikut: ${link}`, // plain text body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
};

module.exports.recoveryMail = async function (user) {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.EMAIL_ADDRESS, // generated ethereal user
            pass: process.env.EMAIL_PASSWORD, // generated ethereal password
        },
    });
    console.log(user._id);
    const token = jwt.sign({ id: user.id }, process.env.TOKEN_RECOVERY, {
        expiresIn: "1d",
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        to: user.email, // list of receivers
        subject: "Confirmation", // Subject line
        text: `Link ganti password: localhost:3000/auth/${token}`, // plain text body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
};
