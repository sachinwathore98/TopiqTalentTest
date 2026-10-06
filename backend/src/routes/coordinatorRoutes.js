const express = require('express');
const router = express.Router();
const { getCoordinatorDashboard } = require('../controllers/coordinatorController');
const { verifyToken, verifyRole } = require('../middleware/multiRoleAuthMiddleware');

// Route for Coordinator Dashboard (Protected by JWT token and restricted to 'coordinator', 'asm', and admin roles)
router.get('/dashboard', verifyToken, verifyRole(['coordinator', 'asm', 'super_admin', 'admin']), getCoordinatorDashboard);

module.exports = router;