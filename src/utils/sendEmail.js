const nodemailer = require('nodemailer');
const { configObject } = require('../config/config');

const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: configObject.gmail_user,
        pass: configObject.gmail_pass
    }
});

exports.sendMail = async (to, subject, html) => {
    await transport.sendMail({
        from: 'Coder test <coderhousep@gmail.com>',
        to,
        subject,
        html
    });
};
