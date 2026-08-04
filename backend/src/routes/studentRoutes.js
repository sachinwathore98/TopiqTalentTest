const express = require('express');
const router = express.Router();
const Student = require('../models/StudentModel');
const SibApiV3Sdk = require('@getbrevo/brevo');

// Initialize Brevo Transactional Email API via HTTPS (Bypasses Render port blocks)
let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
let apiKey = apiInstance.authentications['apiKey'];
apiKey.apiKey = process.env.BREVO_API_KEY;

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

    // 2. Instant response back to frontend for immediate dashboard redirection
    res.status(201).json({ 
      success: true, 
      message: 'Student registered successfully!',
      token: 'sample_student_token_2026'
    });

    // 3. Send emails via Brevo HTTPS API in the background
    const senderInfo = { email: process.env.EMAIL_USER, name: "TOPIQ Talent Test (TTT)" };

    // Admin Notification Email
    const adminEmailData = {
      sender: senderInfo,
      to: [{ email: process.env.ADMIN_EMAIL || process.env.EMAIL_USER, name: "Admin" }],
      subject: `New TTT Student Registration: ${name} (${studentClass})`,
      htmlContent: `
        <h2>New Student Enrollment Received</h2>
        <p><strong>Student Name:</strong> ${name}</p>
        <p><strong>Class/Standard:</strong> ${studentClass}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email || 'N/A'}</p>
        <p><strong>Location:</strong> ${city || ''}, ${district}, ${state || ''} - ${pincode || ''}</p>
      `
    };

    // Student Welcome Email
    const studentEmailData = email ? {
      sender: senderInfo,
      to: [{ email: email, name: name }],
      subject: `Welcome to TTT 2026 – Registration Successful!`,
      htmlContent: `
        <div style="font-family: Arial, sans-serif; color: #01295A; padding: 20px;">
          <h2 style="color: #FE7C02;">Welcome to TOPIQ Talent Test (TTT) 2026!</h2>
          <p>Hi <strong>${name}</strong>,</p>
          <p>Your student account for <strong>${studentClass}</strong> has been created successfully.</p>
          <p>You can now log in to your dashboard, track your progress, and prepare for India's 100-Day MCQ Talent & Scholarship Challenge.</p>
        </div>
      `
    } : null;

    // Dispatch background API calls
    apiInstance.sendTransacEmail(adminEmailData).catch(err => {
      console.error('BREVO API ADMIN ERROR:', err.response?.text || err.message);
    });

    if (studentEmailData) {
      apiInstance.sendTransacEmail(studentEmailData).catch(err => {
        console.error('BREVO API STUDENT ERROR:', err.response?.text || err.message);
      });
    }

  } catch (error) {
    // Gracefully handle duplicate email signups
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'This email is already registered.' });
    }
    console.error('Student registration server error:', error);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: 'Server error while processing student registration.' });
    }
  }
});

module.exports = router;