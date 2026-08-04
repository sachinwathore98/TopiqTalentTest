const express = require('express');
const router = express.Router();
const sendEmail = require('../utils/sendEmail');
// const FranchiseEnquiry = require('../models/FranchiseModel'); // Import your database model

router.post('/enquire', async (req, res) => {
  try {
    const { owner_name, phone, email, pincode, city, district, state, current_business, investment_capacity, preferred_location, requirements } = req.body;

    // 1. SAVE TO DATABASE
    /*
    const newEnquiry = await FranchiseEnquiry.create({
      owner_name, phone, email, pincode, city, district, state, current_business, investment_capacity, preferred_location, requirements
    });
    */

    // 2. SEND EMAIL NOTIFICATION TO ADMIN
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || 'admin@topiqtalenttest.com';
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #01295A; background-color: #f8fafc; border-radius: 12px;">
        <h2 style="color: #FE7C02; border-bottom: 2px solid #FE7C02; padding-bottom: 8px;">New Franchise Enquiry!</h2>
        <p>A potential partner has submitted a franchise application:</p>
        <ul style="list-style-type: none; padding: 0; font-size: 14px; line-height: 1.6;">
          <li><strong>Owner Name:</strong> ${owner_name}</li>
          <li><strong>Mobile Number:</strong> ${phone}</li>
          <li><strong>Email Address:</strong> ${email}</li>
          <li><strong>Location:</strong> ${city}, ${district}, ${state} (${pincode})</li>
          <li><strong>Preferred Territory:</strong> ${preferred_location}</li>
          <li><strong>Current Business:</strong> ${current_business || 'Not specified'}</li>
          <li><strong>Investment Capacity:</strong> ${investment_capacity}</li>
          <li><strong>Requirements / Notes:</strong> ${requirements || 'None'}</li>
          <li><strong>Submission Date:</strong> ${new Date().toLocaleString()}</li>
        </ul>
        <p style="font-size: 12px; color: #64748b; margin-top: 20px;">TOPIQ Talent Test Franchise Network • Balmitra Kids Pvt. Ltd.</p>
      </div>
    `;

    await sendEmail({
      to: adminEmail,
      subject: `🏢 New Franchise Application: ${owner_name} (${city})`,
      htmlContent: emailHtml
    });

    res.status(200).json({
      success: true,
      message: 'Franchise application received, recorded in database, and email sent successfully.'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error during franchise enquiry.' });
  }
});

module.exports = router;