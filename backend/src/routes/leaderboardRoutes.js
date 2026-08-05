const express = require('express');
const router = express.Router();
const { getLeaderboard } = require('../controllers/leaderboardController');
const { verifyToken } = require('../middleware/multiRoleAuthMiddleware');

// Accessible by all authenticated users, but output is filtered automatically based on their role
router.get('/', verifyToken, getLeaderboard);

module.exports = router;