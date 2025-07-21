const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'kamogeloericandrew@gmail.com',
    pass: 'zswcqgigtugmxfyk'
  }
});

module.exports = transporter;
