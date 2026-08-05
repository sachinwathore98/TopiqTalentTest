const jwt = require('jsonwebtoken');

// 1. Verify Authentication Token & Extract User Data
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Expected fields: { id, role, franchiseId }
    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: 'Invalid or expired token.' });
  }
};

// 2. Role-Based Access Enforcement
const verifyRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Unauthorized: Insufficient role permissions.' });
    }
    next();
  };
};

// 3. Block Admin from Revenue & Financial Data (Super Admin Only)
const blockAdminFromFinance = (req, res, next) => {
  if (req.user.role === 'admin') {
    return res.status(403).json({ 
      success: false, 
      message: 'Access Denied: Admins do not have permission to access revenue generation or financial details.' 
    });
  }
  next();
};

// 4. Strict User Creation Hierarchy Validation
const validateUserCreationPermission = (req, res, next) => {
  const creatorRole = req.user.role;
  const { targetRole } = req.body; // The role of the user being created

  let isAllowed = false;

  if (creatorRole === 'super_admin') {
    // Super Admin can create any user role
    isAllowed = true;
  } else if (creatorRole === 'admin') {
    // Admin CANNOT create another admin, but can create franchise_owner, teacher, student
    if (['franchise_owner', 'teacher', 'student'].includes(targetRole)) {
      isAllowed = true;
    }
  } else if (creatorRole === 'franchise_owner') {
    // Franchise Owner can only create students
    if (targetRole === 'student') {
      isAllowed = true;
    }
  }

  if (!isAllowed) {
    return res.status(403).json({ 
      success: false, 
      message: `Permission Denied: A ${creatorRole} is not authorized to create a ${targetRole} user.` 
    });
  }

  next();
};

module.exports = {
  verifyToken,
  verifyRole,
  blockAdminFromFinance,
  validateUserCreationPermission
};