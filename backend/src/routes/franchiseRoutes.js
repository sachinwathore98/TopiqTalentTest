const express = require('express');
const router = express.Router();
const Franchise = require('../models/FranchiseModel');

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
      console.error('Brevo Franchise API Error Response:', errText);
    }
  } catch (err) {
    console.error('Brevo Franchise API Network Exception:', err.message);
  }
}

router.post('/enquire', async (req, res) => {
  try {
    const { 
      owner_name, phone, email, pincode, 
      city, district, state, current_business, 
      investment_capacity, preferred_location, requirements 
    } = req.body;

    if (!owner_name || !phone || !district) {
      return res.status(400).json({ success: false, message: 'Missing required franchise details.' });
    }

    // 1. Save Franchise Enquiry to MongoDB Atlas Database instantly
    const newFranchise = new Franchise({
      owner_name, phone, email, pincode, 
      city, district, state, current_business, 
      investment_capacity, preferred_location, requirements
    });
    await newFranchise.save();

    // 2. Instant response back to frontend so submission succeeds immediately
    res.status(201).json({ 
      success: true, 
      message: 'Franchise application submitted successfully!' 
    });

    // 3. Fire background Brevo API calls (Admin Lead Notification + Owner Welcome)
    const adminEmailHtml = `
      <h2>New Franchise Enquiry Received</h2>
      <p><strong>Owner Name:</strong> ${owner_name}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Email:</strong> ${email || 'N/A'}</p>
      <p><strong>Preferred Location:</strong> ${preferred_location || 'N/A'}</p>
      <p><strong>City / District / State:</strong> ${city || ''}, ${district}, ${state || ''} - ${pincode || ''}</p>
      <p><strong>Current Business:</strong> ${current_business || 'N/A'}</p>
      <p><strong>Investment Capacity:</strong> ${investment_capacity || 'N/A'}</p>
      <p><strong>Requirements:</strong> ${requirements || 'N/A'}</p>
    `;

    const ownerEmailHtml = `
      <div style="font-family: Arial, sans-serif; color: #01295A; padding: 20px;">
        <h2 style="color: #FE7C02;">Thank You for Your Franchise Interest!</h2>
        <p>Dear <strong>${owner_name}</strong>,</p>
        <p>We have successfully received your franchise application for <strong>${city || district}</strong>.</p>
        <p>Our business development team is reviewing your profile and will get in touch with you shortly.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #666;">TOPIQ Talent Test (TTT) Team</p>
      </div>
    `;

    // Send admin notification
    sendBrevoEmail({
      toEmail: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      toName: 'Admin',
      subject: `New Franchise Application from ${owner_name} (${city || district})`,
      htmlContent: adminEmailHtml
    });

    // Send franchise owner welcome email if provided
    if (email) {
      sendBrevoEmail({
        toEmail: email,
        toName: owner_name,
        subject: `Franchise Enquiry Received – TTT 2026`,
        htmlContent: ownerEmailHtml
      });
    }

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'This email is already registered for an enquiry.' });
    }
    console.error('Franchise submission server error:', error);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: 'Server error while processing application.' });
    }
  }
});

module.exports = router;