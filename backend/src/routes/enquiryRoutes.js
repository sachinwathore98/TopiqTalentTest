const express = require('express');
const router = express.Router();
const Enquiry = require('../models/Enquiry');

// Universal shared handler function to process and save any form submission directly to MongoDB `enquiries`
const saveEnquiryHandler = async (req, res, defaultType) => {
  try {
    const { 
      fullName, 
      name, 
      owner_name, 
      phone, 
      email, 
      city, 
      district, 
      pincode, 
      state, 
      message, 
      requirements,
      enquiryType, 
      enrollmentType,
      current_business,
      investment_capacity,
      preferred_location,
      agent_role_type
    } = req.body;
    
    // Determine and normalize lead type across all form variants
    const rawType = enquiryType || enrollmentType || defaultType;
    const normalizedType = String(rawType).toLowerCase();

    // Construct a comprehensive message string if custom business/agent fields are present
    let detailedMessage = message || '';
    if (current_business || investment_capacity || preferred_location || agent_role_type) {
      const extraDetails = [
        current_business ? `Business: ${current_business}` : '',
        investment_capacity ? `Investment/Scope: ${investment_capacity}` : '',
        preferred_location ? `Preferred Location: ${preferred_location}` : '',
        agent_role_type ? `Agent Role: ${agent_role_type}` : '',
        requirements ? `Notes: ${requirements}` : ''
      ].filter(Boolean).join(' | ');

      detailedMessage = detailedMessage ? `${detailedMessage} | ${extraDetails}` : extraDetails;
    }

    const finalType = ['student', 'franchise', 'agent'].includes(normalizedType) ? normalizedType : defaultType;

    const newEnquiry = new Enquiry({
      fullName: fullName || owner_name || name || 'Website Lead',
      phone: phone || '',
      email: email || '',
      city: city || '',
      district: district || '',
      pincode: pincode || '',
      state: state || 'Maharashtra',
      message: detailedMessage,
      enquiryType: finalType,
      status: 'Pending'
    });

    await newEnquiry.save();
    console.log(`[LIVE ENQUIRY SAVED]: Type -> ${finalType}, Name -> ${newEnquiry.fullName}`);
    return res.status(201).json({ success: true, message: 'Enquiry submitted successfully and logged to dashboard!' });
  } catch (err) {
    console.error('Error saving public enquiry:', err);
    return res.status(500).json({ success: false, message: 'Server error saving enquiry.', error: err.message });
  }
};

// 1. General Submit Endpoint (/api/enquiries/submit)
router.post('/submit', async (req, res) => {
  const defaultType = req.body.enquiryType || req.body.enrollmentType || 'student';
  return saveEnquiryHandler(req, res, defaultType);
});

// 2. Franchise Specific Endpoint (/api/franchise/enquire)
router.post('/enquire', async (req, res) => {
  return saveEnquiryHandler(req, res, 'franchise');
});

// 3. Agent Specific Endpoint (/api/agents/enroll)
router.post('/enroll', async (req, res) => {
  return saveEnquiryHandler(req, res, 'agent');
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