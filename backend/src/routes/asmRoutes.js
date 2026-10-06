const express = require('express');
const router = express.Router();
const { getASMDashboard } = require('../controllers/asmController');
const { verifyToken } = require('../middleware/auth'); // ensure middleware path matches your setup

router.get('/dashboard', verifyToken, getASMDashboard);

module.exports = router;