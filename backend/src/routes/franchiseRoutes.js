const express = require('express');
const router = express.Router();
const Enquiry = require('../models/Enquiry');
const { getFranchiseDashboard, provisionMember, removeMember } = require('../controllers/franchiseController');

// Correctly reference your existing multi-role authentication middleware
const { verifyToken } = require('../middleware/multiRoleAuthMiddleware');
const authorizeFranchiseHierarchy = require('../middleware/hierarchyAuth');

// 1. Public Franchise Enquiry Submission Route
router.post('/enquire', async (req, res) => {
  try {
    const { owner_name, name, phone, email, pincode, city, district, state, current_business, investment_capacity, preferred_location, requirements } = req.body;
    
    const fullName = owner_name || name || 'Franchise Applicant';
    const detailedMessage = `Business: ${current_business || 'N/A'} | Investment: ${investment_capacity || 'N/A'} | Location: ${preferred_location || 'N/A'} | Notes: ${requirements || 'None'}`;

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

    return res.status(201).json({ success: true, message: 'Franchise enquiry submitted successfully!' });
  } catch (err) {
    console.error('Franchise route error:', err);
    return res.status(500).json({ success: false, message: 'Server error saving franchise enquiry.' });
  }
});

// 2. Secured Franchise Dashboard & Hierarchy Management Routes
router.get('/dashboard', verifyToken, authorizeFranchiseHierarchy, getFranchiseDashboard);
router.post('/provision-member', verifyToken, authorizeFranchiseHierarchy, provisionMember);
router.delete('/members/:userId', verifyToken, authorizeFranchiseHierarchy, removeMember);

module.exports = router;