const { ExamResult } = require('../models/ExamModel');

// Fetch Comprehensive Analytics for Student or Instructor View
exports.getStudentAnalytics = async (req, res) => {
  try {
    const targetStudentId = req.params.studentId || req.user.id;
    const requestingUserRole = req.user.role;

    // Security check: Students can only view their own analytics
    if (requestingUserRole === 'student' && targetStudentId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized to view other student analytics.' });
    }

    // Fetch all exam attempts for the student
    const attempts = await ExamResult.find({ studentId: targetStudentId }).populate('examId', 'title examType questions');

    if (!attempts || attempts.length === 0) {
      return res.status(200).json({ success: true, message: 'No exam attempts found yet.', data: null });
    }

    let totalExamsAttempted = attempts.length;
    let totalScore = 0;
    let totalCorrect = 0;
    let totalWrong = 0;

    // Day-wise & Subject-wise tracking aggregation
    let dayWiseHistory = [];
    let subjectPerformance = {
      Physics: { correct: 0, total: 0 },
      Chemistry: { correct: 0, total: 0 },
      Maths: { correct: 0, total: 0 }
    };

    attempts.forEach((attempt) => {
      totalScore += attempt.score;
      totalCorrect += attempt.correctCount;
      totalWrong += attempt.wrongCount;

      dayWiseHistory.push({
        date: attempt.submittedAt,
        examTitle: attempt.examId ? attempt.examId.title : 'Daily Challenge',
        score: attempt.score,
        correctCount: attempt.correctCount,
        wrongCount: attempt.wrongCount,
        accuracy: attempt.accuracy
      });
    });

    const overallAccuracy = (totalCorrect / (totalCorrect + totalWrong)) * 100 || 0;

    res.status(200).json({
      success: true,
      summary: {
        totalExamsAttempted,
        totalScore,
        overallAccuracy: overallAccuracy.toFixed(2) + '%',
        totalCorrect,
        totalWrong
      },
      dayWiseHistory
    });

  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ success: false, message: 'Server error while fetching analytics.' });
  }
};