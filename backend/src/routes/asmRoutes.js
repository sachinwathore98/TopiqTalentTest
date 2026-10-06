const express = require('express');
const router = express.Router();
const { getASMDashboard } = require('../controllers/asmController');
const { verifyToken, verifyASM } = require('../middleware/auth'); // adjust based on your auth middleware

router.get('/dashboard', verifyToken, verifyASM, getASMDashboard);

module.exports = router; // or module.exports = router