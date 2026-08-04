const express = require('express');
const router = express.Router();
const sendEmail = require('../utils/sendEmail');
// const Student = require('../models/StudentModel'); // Import your database model

router.post('/register', async (req, res) => {
  try {
    const { name, phone, email, studentClass, pincode, city, district, state, password } = req.body;

    // 1. SAVE TO DATABASE
    /*
    const newStudent = await Student.create({
      name, phone, email, studentClass, pincode, city, district, state, password, is_paid: false
    });
    */

    // 2. SEND EMAIL NOTIFICATION TO ADMIN
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || 'admin@topiqtalenttest.com';
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #01295A; background-color: #f8fafc; border-radius: 12px;">
        <h2 style="color: #FE7C02; border-bottom: 2px solid #FE7C02; padding-bottom: 8px;">New Student Registration!</h2>
        <p>A new student has registered on the TOPIQ Talent Test portal:</p>
        <ul style="list-style-type: none; padding: 0; font-size: 14px; line-height: 1.6;">
          <li><strong>Full Name:</strong> ${name}</li>
          <li><strong>Mobile Number:</strong> ${phone}</li>
          <li><strong>Email Address:</strong> ${email}</li>
          <li><strong>Class / Category:</strong> ${studentClass}</li>
          <li><strong>Location:</strong> ${city}, ${district}, ${state} - ${pincode}</li>
          <li><strong>Registration Date:</strong> ${new Date().toLocaleString()}</li>
        </ul>
        <p style="font-size: 12px; color: #64748b; margin-top: 20px;">TOPIQ Talent Test Automated System • Balmitra Kids Pvt. Ltd.</p>
      </div>
    `;

    await sendEmail({
      to: adminEmail,
      subject: `🎓 New Student Registration: ${name} (${studentClass})`,
      htmlContent: emailHtml
    });

    res.status(201).json({
      success: true,
      message: 'Student registered successfully, data saved, and email notification dispatched.',
      token: 'mock_jwt_token_student_123'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error during student registration.' });
  }
});

module.exports = router;