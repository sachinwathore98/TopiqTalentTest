const express = require('express');
const router = express.Router();
const Student = require('../models/StudentModel');

// Helper function to send emails via Brevo REST API (HTTPS port 443 - never blocked on Render)
async function sendBrevoEmail({ toEmail, toName, subject, htmlContent }) {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.warn('BREVO_API_KEY is not set in environment variables.');
    return;
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': apiKey
      },
      body: JSON.stringify({
        sender: { email: process.env.EMAIL_USER, name: "TOPIQ Talent Test (TTT)" },
        to: [{ email: toEmail, name: toName || 'User' }],
        subject: subject,
        htmlContent: htmlContent
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Brevo API Error Response:', errText);
    }
  } catch (err) {
    console.error('Brevo API Network Exception:', err.message);
  }
}

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

    // 2. Instant response back to frontend for immediate redirection
    res.status(201).json({ 
      success: true, 
      message: 'Student registered successfully!',
      token: 'sample_student_token_2026'
    });

    // 3. Fire background Brevo API calls (Admin + Student Welcome)
    const adminEmailHtml = `
      <h2>New Student Enrollment Received</h2>
      <p><strong>Student Name:</strong> ${name}</p>
      <p><strong>Class/Standard:</strong> ${studentClass}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Email:</strong> ${email || 'N/A'}</p>
      <p><strong>Location:</strong> ${city || ''}, ${district}, ${state || ''} - ${pincode || ''}</p>
    `;

    const studentEmailHtml = `
      <div style="font-family: Arial, sans-serif; color: #01295A; padding: 20px;">
        <h2 style="color: #FE7C02;">Welcome to TOPIQ Talent Test (TTT) 2026!</h2>
        <p>Hi <strong>${name}</strong>,</p>
        <p>Your student account for <strong>${studentClass}</strong> has been created successfully.</p>
        <p>You can now log in to your dashboard, track your progress, and prepare for India's 100-Day MCQ Talent & Scholarship Challenge.</p>
      </div>
    `;

    // Send admin notification
    sendBrevoEmail({
      toEmail: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      toName: 'Admin',
      subject: `New TTT Student Registration: ${name} (${studentClass})`,
      htmlContent: adminEmailHtml
    });

    // Send student welcome email if provided
    if (email) {
      sendBrevoEmail({
        toEmail: email,
        toName: name,
        subject: `Welcome to TTT 2026 – Registration Successful!`,
        htmlContent: studentEmailHtml
      });
    }

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'This email is already registered. Please log in.' });
    }
    console.error('Student registration server error:', error);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: 'Server error while processing student registration.' });
    }
  }
});

module.exports = router;