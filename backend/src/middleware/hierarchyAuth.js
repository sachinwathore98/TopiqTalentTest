// backend/middleware/hierarchyAuth.js
const User = require('../models/User');

const authorizeFranchiseHierarchy = async (req, res, next) => {
  try {
    const user = req.user; // Populated by JWT authentication middleware
    if (!user) {
      return res.status(401).json({ success: false, message: 'Unauthorized access.' });
    }

    if (user.role === 'super_admin' || user.role === 'admin') {
      return next(); // Admins have global access
    }

    if (user.role === 'franchise' || user.role === 'franchise_owner') {
      // Scope queries strictly to this franchisee's ID
      req.franchiseScope = user._id;
      return next();
    }

    return res.status(403).json({ success: false, message: 'Access forbidden for this role.' });
  } catch (err) {
    console.error('Hierarchy authorization error:', err);
    return res.status(500).json({ success: false, message: 'Internal authorization error.' });
  }
};

module.exports = authorizeFranchiseHierarchy;