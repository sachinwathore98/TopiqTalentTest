const express = require('express');
const router = express.Router();
const { 
  getASMDashboard, 
  provisionCoordinator, 
  updateCoordinator, 
  deleteCoordinator, 
  requestWithdrawal 
} = require('../controllers/asmController');
const { verifyToken, verifyRole } = require('../middleware/multiRoleAuthMiddleware');

router.get('/dashboard', verifyToken, verifyRole(['asm', 'super_admin', 'admin']), getASMDashboard);
router.post('/coordinators', verifyToken, verifyRole(['asm', 'super_admin', 'admin']), provisionCoordinator);
router.put('/coordinators/:userId', verifyToken, verifyRole(['asm', 'super_admin', 'admin']), updateCoordinator);
router.delete('/coordinators/:userId', verifyToken, verifyRole(['asm', 'super_admin', 'admin']), deleteCoordinator);
router.post('/withdraw', verifyToken, verifyRole(['asm', 'super_admin', 'admin']), requestWithdrawal);

module.exports = router;