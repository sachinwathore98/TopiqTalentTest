const express = require('express');
const router = express.Router();
const Franchise = require('../models/FranchiseModel');
const nodemailer = require('nodemailer');

// Configure Nodemailer transporter using explicit SMTP settings
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, // true for 465, false for port 587
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS  
  }
});

router.post('/enquire', async (req, res) => {
  try {
    const { 
      owner_name, phone, email, pincode, 
      city, district, state, current_business, 
      investment_capacity, preferred_location, requirements 
    } = req.body;

    // 1. Save to MongoDB Atlas Database
    const newFranchise = new Franchise({
      owner_name, phone, email, pincode, 
      city, district, state, current_business, 
      investment_capacity, preferred_location, requirements
    });
    await newFranchise.save();

    // 2. Send Email Notification to Admin
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      subject: `New Franchise Application from ${owner_name} (${city})`,
      html: `
        <h2>New Franchise Enquiry Received</h2>
        <p><strong>Owner Name:</strong> ${owner_name}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Location:</strong> ${preferred_location}, ${city}, ${district}, ${state} - ${pincode}</p>
        <p><strong>Current Business:</strong> ${current_business || 'N/A'}</p>
        <p><strong>Investment Capacity:</strong> ${investment_capacity}</p>
        <p><strong>Requirements/Queries:</strong> ${requirements || 'N/A'}</p>
      `
    };

    // Await email dispatch to catch and log any SMTP errors precisely
    await transporter.sendMail(mailOptions);
    console.log('Franchise notification email sent successfully!');

    res.status(201).json({ success: true, message: 'Franchise application submitted successfully!' });
  } catch (error) {
    console.error('Franchise submission server error:', error);
    res.status(500).json({ success: false, message: 'Server error while processing application.' });
  }
});

module.exports = router;