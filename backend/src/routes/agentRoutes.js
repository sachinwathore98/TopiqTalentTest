const express = require('express');
const router = express.Router();
const axios = require('axios');

// Register or Enquire as an Agent / Employee Partner (20% Incentive)
router.post('/enroll', async (req, res) => {
  try {
    const { owner_name, phone, email, pincode, city, district, state, agent_role_type, investment_capacity, preferred_location, requirements, incentiveStructure } = req.body;
    
    console.log('New Agent Partner Enrolled:', { owner_name, phone, email, city, agent_role_type });

    // Send email notification via Brevo API (matching your production configuration)
    const brevoApiKey = process.env.BREVO_API_KEY || process.env.SENDINBLUE_API_KEY;
    
    if (brevoApiKey) {
      const emailData = {
        sender: { name: "TOPIQ Talent Test (TTT)", email: "topiqtalenttest@gmail.com" },
        to: [
          { email: email, name: owner_name },
          { email: "topiqtalenttest@gmail.com", name: "TOPIQ Admin" }
        ],
        subject: `New Agent Partner Application - ${owner_name} (${city})`,
        htmlContent: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #01295A;">
            <h2 style="color: #FE7C02;">New Agent / Partner Enrollment Received</h2>
            <p>A new candidate has registered through the Agent & Employee Partner program on the TTT website.</p>
            <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
              <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Full Name:</td><td style="padding: 8px; border: 1px solid #ddd;">${owner_name}</td></tr>
              <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Mobile:</td><td style="padding: 8px; border: 1px solid #ddd;">${phone}</td></tr>
              <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Email:</td><td style="padding: 8px; border: 1px solid #ddd;">${email}</td></tr>
              <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Location:</td><td style="padding: 8px; border: 1px solid #ddd;">${preferred_location}, ${city}, ${district}, ${state} - ${pincode}</td></tr>
              <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Role Type:</td><td style="padding: 8px; border: 1px solid #ddd;">${agent_role_type}</td></tr>
              <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Target Scope:</td><td style="padding: 8px; border: 1px solid #ddd;">${investment_capacity}</td></tr>
              <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Incentive Model:</td><td style="padding: 8px; border: 1px solid #ddd;">${incentiveStructure || '20% Commission Incentive'}</td></tr>
              <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Requirements:</td><td style="padding: 8px; border: 1px solid #ddd;">${requirements || 'None'}</td></tr>
            </table>
            <p style="margin-top: 20px; font-size: 12px; color: #666;">TOPIQ Talent Test (TTT) Automated Partnership System</p>
          </div>
        `
      };

      await axios.post('https://api.brevo.com/v3/smtp/email', emailData, {
        headers: {
          'api-key': brevoApiKey,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Agent partnership enrollment received successfully! 20% incentive program activated.'
    });
  } catch (error) {
    console.error('Agent enrollment email dispatch error:', error?.response?.data || error.message);
    return res.status(500).json({ success: false, message: 'Server error during agent enrollment.' });
  }
});

router.get('/list', async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      data: []
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error fetching agents.' });
  }
});

module.exports = router;