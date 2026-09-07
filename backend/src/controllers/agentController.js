const Enquiry = require('../models/Enquiry');

exports.handleAgentEnrollment = async (req, res) => {
  try {
    const { owner_name, phone, email, pincode, city, district, state, agent_role_type, investment_capacity, preferred_location, requirements } = req.body;

    const newEnquiry = new Enquiry({
      fullName: owner_name,
      phone,
      email,
      pincode,
      city,
      district,
      state: state || 'Maharashtra',
      message: `Role Type: ${agent_role_type} | Target Scope: ${investment_capacity} | Preferred Location: ${preferred_location} | Notes: ${requirements || 'None'}`,
      enquiryType: 'agent', // Crucial for Super Admin sub-tab segmentation
      status: 'Pending'
    });

    await newEnquiry.save();
    return res.status(201).json({ success: true, message: 'Agent partnership enrollment received!' });
  } catch (err) {
    console.error('Agent enrollment error:', err);
    return res.status(500).json({ success: false, message: 'Server error saving agent enrollment.' });
  }
};