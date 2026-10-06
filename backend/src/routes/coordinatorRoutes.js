const express = require('express');
const router = express.Router();
const { 
  getCoordinatorDashboard, 
  getHierarchy, 
  createRazorpayOrder, 
  verifyAndCreateAdmission 
} = require('../controllers/coordinatorController');
const { verifyToken } = require('../middleware/multiRoleAuthMiddleware');

// Ensure all handlers are valid functions before passing to router
if (typeof getCoordinatorDashboard !== 'function') {
  console.error('CRITICAL: getCoordinatorDashboard is not a function');
}

router.get('/dashboard', verifyToken, getCoordinatorDashboard);
router.get('/hierarchy', verifyToken, getHierarchy);
router.post('/create-order', verifyToken, createRazorpayOrder);
router.post('/verify-admission', verifyToken, verifyAndCreateAdmission);
router.put('/admissions/:admissionId', verifyToken, updateAdmission);

module.exports = router;