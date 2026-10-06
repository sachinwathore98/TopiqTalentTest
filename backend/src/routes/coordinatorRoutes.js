const express = require('express');
const router = express.Router();
const { getCoordinatorDashboard } = require('../controllers/coordinatorController');
const { verifyToken, verifyCoordinator } = require('../middleware/auth'); // adjust based on your auth middleware

router.get('/dashboard', verifyToken, verifyCoordinator, getCoordinatorDashboard);

module.exports = router;