const express = require('express');
const router = express.Router();
const Student = require('../models/StudentModel');
const nodemailer = require('nodemailer');

// Configure Nodemailer transporter using explicit SMTP settings
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, 
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS  
  }
});

router.post('/register', async (req, res) => {
  try {
    const { 
      name, phone, email, studentClass, 
      pincode, city, district, state, password 
    } = req.body;

    // Validate required fields matching the frontend form state
    if (!name || !phone || !studentClass || !district) {
      return res.status(400).json({ success: false, message: 'Missing required student details.' });
    }

    // 1. Save Student to MongoDB Atlas Database
    const newStudent = new Student({
      name,
      phone,
      email,
      studentClass,
      pincode,
      city,
      district,
      state,
      password // Note: In production, hash this password with bcrypt if using login authentications
    });
    await newStudent.save();

    // 2. Send Email Notification to Admin
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      subject: `New TTT Student Registration: ${name} (${studentClass})`,
      html: `
        <h2>New Student Enrollment Received</h2>
        <p><strong>Student Name:</strong> ${name}</p>
        <p><strong>Class/Standard:</strong> ${studentClass}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email || 'N/A'}</p>
        <p><strong>Location:</strong> ${city}, ${district}, ${state} - ${pincode}</p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Student registration notification email sent successfully!');

    res.status(201).json({ 
      success: true, 
      message: 'Student registered successfully!',
      token: 'sample_student_token_2026' // Matches frontend localStorage expectation
    });
  } catch (error) {
    console.error('Student registration server error:', error);
    res.status(500).json({ success: false, message: 'Server error while processing student registration.' });
  }
});

module.exports = router;