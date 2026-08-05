const Result = require('../models/ResultModel'); // Assuming your exam result schema

// Fetch Leaderboard based on Scope and Role Visibility Rules
exports.getLeaderboard = async (req, res) => {
  try {
    const { role, franchiseId } = req.user;
    const { scope } = req.query; // 'franchise', 'city', 'district', 'state'

    let query = {};

    // 1. Apply Scope Filtering
    if (scope === 'franchise') {
      if (!franchiseId) {
        return res.status(400).json({ success: false, message: 'Franchise ID required for franchise-wise scope.' });
      }
      query.franchiseId = franchiseId;
    } 
    // For city, district, or state, filter via the student/franchise location references
    else if (scope === 'city' || scope === 'district' || scope === 'state') {
      // Example geographic filtering logic based on your location schemas
      // query[scope] = req.query.locationValue; 
    }

    // 2. Fetch Leaderboard Data sorted by highest score
    let leaderboardData = await Result.find(query)
      .populate({
        path: 'studentId',
        select: 'name franchise city district state'
      })
      .sort({ score: -1 })
      .limit(100);

    // 3. Enforce Visibility Rules
    if (role === 'student') {
      // Students can ONLY see: Rank, Name, Score, Franchise. 
      // Analytics, accuracy, streaks, and detailed reports are strictly masked.
      leaderboardData = leaderboardData.map((item, index) => ({
        rank: index + 1,
        name: item.studentId ? item.studentId.name : 'Unknown',
        score: item.score,
        franchise: item.studentId ? item.studentId.franchise : 'N/A'
      }));
    } else {
      // Teachers, Admins, Franchise Owners, and Super Admins can see full performance metrics
      leaderboardData = leaderboardData.map((item, index) => ({
        rank: index + 1,
        student: item.studentId,
        score: item.score,
        accuracy: item.accuracy,
        correctCount: item.correctCount,
        wrongCount: item.wrongCount,
        weaknessPatterns: item.weaknessPatterns || []
      }));
    }

    res.status(200).json({
      success: true,
      scope: scope || 'overall',
      count: leaderboardData.length,
      data: leaderboardData
    });

  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching leaderboard.' });
  }
};