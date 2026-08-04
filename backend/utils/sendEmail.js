const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, htmlContent }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER, // e.g. support@topiqtalenttest.com
        pass: process.env.SMTP_PASS  // App password
      }
    });

    await transporter.sendMail({
      from: `"TOPIQ Talent Test Portal" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html: htmlContent
    });

    console.log('Email notification sent successfully!');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = sendEmail;