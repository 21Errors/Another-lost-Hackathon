const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: '',
  auth: {
    user: '',
    pass: ''
  }
});

module.exports = transporter;
