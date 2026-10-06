const express = require('express');
const router = express.Router();
const { getASMDashboard } = require('../controllers/asmController');
const { verifyToken, verifyRole } = require('../middleware/multiRoleAuthMiddleware');

// Route for ASM Dashboard (Protected by JWT token and restricted to 'asm' and admin roles)
router.get('/dashboard', verifyToken, verifyRole(['asm', 'super_admin', 'admin']), getASMDashboard);

module.exports = router;