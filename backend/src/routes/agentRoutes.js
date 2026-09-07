const express = require('express');
const router = express.Router();

// Register or Enquire as an Agent / Employee Partner (20% Incentive)
router.post('/enroll', async (req, res) => {
  try {
    const { owner_name, phone, email, pincode, city, district, state, agent_role_type, preferred_location, requirements } = req.body;
    
    // Here you can save the agent details to MongoDB or trigger a notification email
    console.log('New Agent Partner Enrolled:', { owner_name, phone, email, city, agent_role_type });

    return res.status(201).json({
      success: true,
      message: 'Agent partnership enrollment received successfully! 20% incentive program activated.'
    });
  } catch (error) {
    console.error('Agent enrollment error:', error);
    return res.status(500).json({ success: false, message: 'Server error during agent enrollment.' });
  }
});

// Optional: List agents for the franchise dashboard
router.get('/list', async (req, res) => {
  try {
    // Mock or database fetch for agents
    return res.status(200).json({
      success: true,
      data: []
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error fetching agents.' });
  }
});

module.exports = router;