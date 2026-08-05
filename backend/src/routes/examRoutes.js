const express = require('express');
const router = express.Router();
const { createExam, submitExam } = require('../controllers/examController');
const { verifyToken, verifyRole } = require('../middleware/multiRoleAuthMiddleware');

// Teacher / Admin can create exams
router.post('/create', verifyToken, verifyRole(['super_admin', 'admin', 'teacher']), createExam);

// Students can submit daily exams
router.post('/submit', verifyToken, verifyRole(['student']), submitExam);

module.exports = router;