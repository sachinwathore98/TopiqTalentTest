const express = require('express');
const router = express.Router();
const Student = require('../models/StudentModel');
const nodemailer = require('nodemailer');

// Configure Nodemailer transporter using Brevo SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
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

    if (!name || !phone || !studentClass || !district) {
      return res.status(400).json({ success: false, message: 'Missing required student details.' });
    }

    // 1. Save Student to MongoDB Atlas Database instantly
    const newStudent = new Student({
      name, phone, email, studentClass, 
      pincode, city, district, state, password
    });
    await newStudent.save();

    // 2. Instant response back to frontend so redirection is instant
    res.status(201).json({ 
      success: true, 
      message: 'Student registered successfully!',
      token: 'sample_student_token_2026'
    });

    // 3. Background dispatch via Brevo (Admin Notification + Student Welcome Mail) with full diagnostic logging
    const adminMailOptions = {
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

    const studentWelcomeOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Welcome to TTT 2026 – Registration Successful!`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #01295A; padding: 20px;">
          <h2 style="color: #FE7C02;">Welcome to TOPIQ Talent Test (TTT) 2026!</h2>
          <p>Hi <strong>${name}</strong>,</p>
          <p>Your student account for <strong>${studentClass}</strong> has been created successfully.</p>
          <p>You can now log in to your dashboard, track your progress, and prepare for India's 100-Day MCQ Talent & Scholarship Challenge.</p>
        </div>
      `
    };

    if (email) {
      transporter.sendMail(studentWelcomeOptions).catch(err => {
        console.error('BREVO STUDENT EMAIL FULL ERROR:', JSON.stringify(err, null, 2));
      });
    }
    transporter.sendMail(adminMailOptions).catch(err => {
      console.error('BREVO ADMIN EMAIL FULL ERROR:', JSON.stringify(err, null, 2));
    });

  } catch (error) {
    console.error('Student registration server error:', error);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: 'Server error while processing student registration.' });
    }
  }
});

module.exports = router;