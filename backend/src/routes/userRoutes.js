const express = require('express');
const router = express.Router();
const { loginUser, createUser } = require('../controllers/userController');
const { verifyToken, verifyRole, validateUserCreationPermission } = require('../middleware/multiRoleAuthMiddleware');

// Public route for authentication
router.post('/login', loginUser);

// Protected route for hierarchical user creation
router.post(
  '/create',
  verifyToken,
  verifyRole(['super_admin', 'admin', 'franchise_owner']),
  validateUserCreationPermission,
  createUser
);

module.exports = router;