const express = require('express');
const router = express.Router();
const { getStudentAnalytics } = require('../controllers/analyticsController');
const { verifyToken } = require('../middleware/multiRoleAuthMiddleware');

// Students can view their own analytics; Teachers/Admins can view any student's analytics by passing ID
router.get('/:studentId?', verifyToken, getStudentAnalytics);

module.exports = router;