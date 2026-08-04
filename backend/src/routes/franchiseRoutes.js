const express = require('express');
const router = express.Router();
const Franchise = require('../models/FranchiseModel');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
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

    const newFranchise = new Franchise({
      owner_name, phone, email, pincode, 
      city, district, state, current_business, 
      investment_capacity, preferred_location, requirements
    });
    await newFranchise.save();

    res.status(201).json({ success: true, message: 'Franchise application submitted successfully!' });

    const adminMail = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      subject: `New Franchise Application from ${owner_name} (${city})`,
      html: `
        <h2>New Franchise Enquiry Received</h2>
        <p><strong>Owner Name:</strong> ${owner_name}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Location:</strong> ${preferred_location}, ${city}, ${district}, ${state} - ${pincode}</p>
        <p><strong>Investment Capacity:</strong> ${investment_capacity}</p>
      `
    };

    const ownerWelcome = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Franchise Enquiry Received - TTT 2026`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #01295A; padding: 20px;">
          <h2 style="color: #FE7C02;">Thank You for Your Franchise Interest!</h2>
          <p>Dear <strong>${owner_name}</strong>,</p>
          <p>We have received your franchise application for <strong>${city}, ${district}</strong>. Our business development team will review your application and get in touch with you shortly.</p>
        </div>
      `
    };

    if (email) {
      transporter.sendMail(ownerWelcome).catch(err => console.error('Brevo franchise owner email error:', err));
    }
    transporter.sendMail(adminMail).catch(err => console.error('Brevo franchise admin email error:', err));

  } catch (error) {
    console.error('Franchise submission server error:', error);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: 'Server error while processing application.' });
    }
  }
});

module.exports = router;