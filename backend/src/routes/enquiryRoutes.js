const express = require('express');
const router = express.Router();
const Enquiry = require('../models/Enquiry');

// Public form submission endpoint
router.post('/submit', async (req, res) => {
  try {
    const { fullName, name, phone, email, city, district, pincode, state, message, enquiryType } = req.body;
    
    // Normalize type (default to 'student' if not specified)
    const normalizedType = (enquiryType || 'student').toLowerCase();

    const newEnquiry = new Enquiry({
      fullName: fullName || name || 'Website Lead',
      phone,
      email,
      city,
      district,
      pincode,
      state: state || 'Maharashtra',
      message,
      enquiryType: normalizedType, // 'student', 'franchise', or 'agent'
      status: 'Pending'
    });

    await newEnquiry.save();
    return res.status(201).json({ success: true, message: 'Enquiry submitted successfully!' });
  } catch (err) {
    console.error('Error saving public enquiry:', err);
    return res.status(500).json({ success: false, message: 'Server error saving enquiry.' });
  }
});

module.exports = router;