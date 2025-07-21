const transporter = require('../config/email');
const db = require('../config/db');

async function sendNotificationEmails(type, content) {
  let column = '';
  if (type === 'document') column = 'notify_documents';
  if (type === 'news') column = 'notify_news';
  if (type === 'event') column = 'notify_events';

  if (!column) return;

  try {
    // Get users who want this type
    const [rows] = await db.query(
      `SELECT u.email FROM notifications n JOIN users u ON n.user_id = u.id WHERE n.${column} = TRUE`
    );

    if (rows.length === 0) {
      console.log(`No subscribers for ${type}`);
      return;
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      subject: `New ${type} published: ${content.title}`,
      html: `<p>Hi there,</p><p>A new ${type} has been added: <strong>${content.title}</strong>.</p><p>Check it out: <a href="${content.url}">${content.url}</a></p>`
    };

    for (const row of rows) {
      await transporter.sendMail({ ...mailOptions, to: row.email });
    }

    console.log(`✅ Emails sent to ${rows.length} subscribers`);
  } catch (err) {
    console.error(`❌ Email sending failed: ${err}`);
  }
}

module.exports = sendNotificationEmails;
