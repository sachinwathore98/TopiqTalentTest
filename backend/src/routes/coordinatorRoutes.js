const express = require('express');
const router = express.Router();
const { getCoordinatorDashboard } = require('../controllers/coordinatorController');
const { verifyToken } = require('../middleware/auth');

router.get('/dashboard', verifyToken, getCoordinatorDashboard);

module.exports = router;