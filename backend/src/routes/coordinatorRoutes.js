const express = require('express');
const router = express.Router();
const { getCoordinatorDashboard, getHierarchy, createAdmission } = require('../controllers/coordinatorController');
const { verifyToken } = require('../middleware/multiRoleAuthMiddleware');

router.get('/dashboard', verifyToken, getCoordinatorDashboard);
router.get('/hierarchy', verifyToken, getHierarchy);
router.post('/admissions', verifyToken, createAdmission);

module.exports = router;