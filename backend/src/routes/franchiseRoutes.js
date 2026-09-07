const express = require('express');
const router = express.Router();
const Enquiry = require('../models/Enquiry');
// Keep your existing Brevo or email transporter imports here if any

router.post('/enquire', async (req, res) => {
  try {
    const { owner_name, name, phone, email, pincode, city, district, state, current_business, investment_capacity, preferred_location, requirements } = req.body;
    
    const fullName = owner_name || name || 'Franchise Applicant';
    const detailedMessage = `Business: ${current_business || 'N/A'} | Investment: ${investment_capacity || 'N/A'} | Location: ${preferred_location || 'N/A'} | Notes: ${requirements || 'None'}`;

    // 1. Save to universal Enquiry collection for Super Admin dashboard visibility
    const newEnquiry = new Enquiry({
      fullName,
      phone: phone || '',
      email: email || '',
      city: city || '',
      district: district || '',
      pincode: pincode || '',
      state: state || 'Maharashtra',
      message: detailedMessage,
      enquiryType: 'franchise',
      status: 'Pending'
    });
    await newEnquiry.save();

    // (Your existing email trigger logic goes here...)

    return res.status(201).json({ success: true, message: 'Franchise enquiry submitted successfully!' });
  } catch (err) {
    console.error('Franchise route error:', err);
    return res.status(500).json({ success: false, message: 'Server error saving franchise enquiry.' });
  }
});

module.exports = router;