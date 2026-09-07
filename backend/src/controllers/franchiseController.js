const Enquiry = require('../models/Enquiry');

exports.handleFranchiseEnquiry = async (req, res) => {
  try {
    const { owner_name, phone, email, pincode, city, district, state, current_business, investment_capacity, preferred_location, requirements } = req.body;

    const newEnquiry = new Enquiry({
      fullName: owner_name,
      phone,
      email,
      pincode,
      city,
      district,
      state: state || 'Maharashtra',
      message: `Business: ${current_business || 'N/A'} | Investment: ${investment_capacity} | Location: ${preferred_location} | Notes: ${requirements || 'None'}`,
      enquiryType: 'franchise', // Crucial for Super Admin sub-tab segmentation
      status: 'Pending'
    });

    await newEnquiry.save();
    return res.status(201).json({ success: true, message: 'Franchise application submitted successfully!' });
  } catch (err) {
    console.error('Franchise enquiry error:', err);
    return res.status(500).json({ success: false, message: 'Server error saving franchise enquiry.' });
  }
};