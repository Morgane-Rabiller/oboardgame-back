require('dotenv').config();
const fs = require('fs');
const nodemailer = require("nodemailer");

const contactMail = {

    transporter: nodemailer.createTransport({
        service: 'gmail',
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.MAILPASS,
        },
        tls: {
            rejectUnauthorized: false
        }
    }),

    logoAttachment: {
        filename: 'oboardgame.png',
        content: fs.readFileSync('./services/imgs/oboardgame.png'),
        cid: 'logo',
    },

    sendMail: async (to, subject, html) => {
        const  mailOptions = {
            from: process.env.EMAIL,
            to,
            subject,
            html,
            attachments: [contactMail.logoAttachment],
        };
        return contactMail.transporter.sendMail(mailOptions);
    },

    receiveMail: async (from, subject, html) => {
        const  mailOptions = {
            from: `"Utilisateur OBoardgame" <${process.env.EMAIL}>`,
            to: process.env.EMAIL,
            subject,
            html,
            replyTo: from,
        };
        return contactMail.transporter.sendMail(mailOptions);
    },
}
module.exports = contactMail;