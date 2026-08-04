const db = require('../config/db');

exports.submitEnquiry = async (req, res) => {
  const { owner_name, email, phone, city, district, office_address, office_sqft } = req.body;

  if (!owner_name || !phone || !district) {
    return res.status(400).json({ success: false, message: 'Missing required parameters.' });
  }

  try {
    const branchCode = `TTT-FR-${district.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const query = `
      INSERT INTO franchises (branch_code, owner_name, email, phone, city, district, office_address, office_sqft)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, branch_code, status;
    `;
    
    const result = await db.query(query, [
      branchCode, owner_name, email, phone, city, district, office_address, office_sqft || 150
    ]);

    res.status(201).json({
      success: true,
      message: 'Franchise inquiry submitted successfully.',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Franchise Inquiry Error:', error);
    res.status(500).json({ success: false, message: 'Server processing error.' });
  }
};