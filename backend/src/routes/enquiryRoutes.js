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
      phone: phone || '',
      email: email || '',
      city: city || '',
      district: district || '',
      pincode: pincode || '',
      state: state || 'Maharashtra',
      message: message || '',
      enquiryType: normalizedType,
      status: 'Pending'
    });

    await newEnquiry.save();
    return res.status(201).json({ success: true, message: 'Enquiry submitted successfully!' });
  } catch (err) {
    console.error('Error saving public enquiry:', err);
    return res.status(500).json({ success: false, message: 'Server error saving enquiry.', error: err.message });
  }
});

// Temporary seed route with detailed error catching
router.get('/seed-test-leads', async (req, res) => {
  try {
    await Enquiry.deleteMany({});
    await Enquiry.insertMany([
      { fullName: 'Rahul Student', phone: '9876543210', email: 'rahul@student.com', city: 'Pune', enquiryType: 'student', status: 'Pending', message: 'Interested in Class 10 exam.' },
      { fullName: 'Apex Franchise Hub', phone: '9123456789', email: 'contact@apexfranchise.com', city: 'Nagpur', enquiryType: 'franchise', status: 'Pending', message: 'Want to partner as a franchise.' },
      { fullName: 'Vikas Agent', phone: '9988776655', email: 'vikas@agent.com', city: 'Nashik', enquiryType: 'agent', status: 'Pending', message: 'Applying for agent commission role.' }
    ]);
    return res.status(200).json({ success: true, message: 'Test enquiries seeded successfully!' });
  } catch (err) {
    console.error('Seeding error details:', err);
    return res.status(500).json({ success: false, message: 'Seeding failed.', error: err.message });
  }
});

module.exports = router;