const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, htmlContent }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER, // topiqtalenttest@gmail.com
        pass: process.env.SMTP_PASS  // Gmail App Password
      }
    });

    await transporter.sendMail({
      from: `"TOPIQ Talent Test Portal" <${process.env.SMTP_USER}>`,
      to: to || process.env.ADMIN_NOTIFICATION_EMAIL,
      subject,
      html: htmlContent
    });

    console.log('Email notification dispatched successfully to topiqtalenttest@gmail.com');
  } catch (error) {
    console.error('Error sending email notification:', error);
  }
};

module.exports = sendEmail;