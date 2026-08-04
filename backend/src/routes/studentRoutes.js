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
      student_name, email, phone, class_standard, 
      city, district, school_name 
    } = req.body;

    if (!student_name || !phone || !class_standard || !district) {
      return res.status(400).json({ success: false, message: 'Missing required student details.' });
    }

    // 1. Save Student to MongoDB Atlas Database
    const newStudent = new Student({
      student_name, email, phone, class_standard, 
      city, district, school_name
    });
    await newStudent.save();

    // 2. Send Email Notification to Admin
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      subject: `New TTT Student Registration: ${student_name} (Class ${class_standard})`,
      html: `
        <h2>New Student Enrollment Received</h2>
        <p><strong>Student Name:</strong> ${student_name}</p>
        <p><strong>Class/Standard:</strong> ${class_standard}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email || 'N/A'}</p>
        <p><strong>Location:</strong> ${city}, ${district}</p>
        <p><strong>School Name:</strong> ${school_name || 'N/A'}</p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Student registration notification email sent successfully!');

    res.status(201).json({ success: true, message: 'Student registered successfully!' });
  } catch (error) {
    console.error('Student registration server error:', error);
    res.status(500).json({ success: false, message: 'Server error while processing student registration.' });
  }
});

module.exports = router;