const express = require('express');
const router = express.Router();
const Enquiry = require('../models/Enquiry');
// Keep your existing email transporter imports here if any

router.post('/enroll', async (req, res) => {
  try {
    const { owner_name, name, phone, email, pincode, city, district, state, agent_role_type, investment_capacity, preferred_location, requirements } = req.body;
    
    const fullName = owner_name || name || 'Agent Partner';
    const detailedMessage = `Agent Role: ${agent_role_type || 'N/A'} | Scope: ${investment_capacity || 'N/A'} | Location: ${preferred_location || 'N/A'} | Notes: ${requirements || 'None'}`;

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
      enquiryType: 'agent',
      status: 'Pending'
    });
    await newEnquiry.save();

    // (Your existing email trigger logic goes here...)

    return res.status(201).json({ success: true, message: 'Agent partnership enrollment received!' });
  } catch (err) {
    console.error('Agent route error:', err);
    return res.status(500).json({ success: false, message: 'Server error saving agent enrollment.' });
  }
});

module.exports = router;