const express = require('express');
const router = express.Router();
const { createUser } = require('../controllers/userController');
const { verifyToken, verifyRole, validateUserCreationPermission } = require('../middleware/multiRoleAuthMiddleware');

// Protected Route: Only Super Admin, Admin, and Franchise Owners can access user creation,
// and middleware validates if their specific role is allowed to create the target role.
router.post(
  '/create',
  verifyToken,
  verifyRole(['super_admin', 'admin', 'franchise_owner']),
  validateUserCreationPermission,
  createUser
);

module.exports = router;