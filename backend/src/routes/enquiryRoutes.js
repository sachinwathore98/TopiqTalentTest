const express = require('express');
const router = express.Router();
const Enquiry = require('../models/Enquiry');

// Public form submission endpoint
router.post('/submit', async (req, res) => {
  try {
    const { fullName, name, phone, email, city, district, pincode, state, message, enquiryType } = req.body;
    const normalizedType = (enquiryType || 'student').toLowerCase();

    const newEnquiry = new Enquiry({
      fullName: fullName || name || 'Website Lead',
      phone: phone || '9999999999',
      email: email || 'lead@test.com',
      city: city || 'Chhatrapati Sambhajinagar',
      district: district || 'Aurangabad',
      pincode: pincode || '431001',
      state: state || 'Maharashtra',
      message: message || 'Interested in ecosystem partnership.',
      enquiryType: normalizedType, // 'student', 'franchise', or 'agent'
      status: 'Pending'
    });

    await newEnquiry.save();
    return res.status(201).json({ success: true, message: 'Enquiry saved successfully!' });
  } catch (err) {
    console.error('Error saving enquiry:', err);
    return res.status(500).json({ success: false, message: 'Server error saving enquiry.' });
  }
});

module.exports = router;