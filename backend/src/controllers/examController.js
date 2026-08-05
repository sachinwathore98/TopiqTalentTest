const { Exam, ExamResult } = require('../models/ExamModel');

// Teacher: Upload Exam & Questions
exports.createExam = async (req, res) => {
  try {
    const { title, examType, questions } = req.body;
    
    const newExam = new Exam({ title, examType, questions });
    await newExam.save();

    res.status(201).json({ success: true, message: 'Exam created successfully', examId: newExam._id });
  } catch (error) {
    console.error('Error creating exam:', error);
    res.status(500).json({ success: false, message: 'Server error while creating exam.' });
  }
};

// Student: Submit Daily Exam with +4 / -1 Scoring Logic
exports.submitExam = async (req, res) => {
  try {
    const { examId, answers } = req.body; // answers = [{ questionId, selectedOption }]
    const studentId = req.user.id;

    const exam = await Exam.findById(examId);
    if (!exam) return res.status(404).json({ success: false, message: 'Exam not found.' });

    let score = 0;
    let correctCount = 0;
    let wrongCount = 0;

    exam.questions.forEach((q) => {
      const studentAnswer = answers.find(a => a.questionId === q._id.toString());
      if (studentAnswer !== undefined) {
        if (studentAnswer.selectedOption === q.correctOption) {
          score += 4;       // +4 Marks for correct answer
          correctCount += 1;
        } else {
          score -= 1;       // -1 Mark for incorrect answer (25% negative marking)
          wrongCount += 1;
        }
      }
    });

    const totalAttempted = correctCount + wrongCount;
    const accuracy = totalAttempted > 0 ? (correctCount / totalAttempted) * 100 : 0;

    const result = new ExamResult({
      studentId,
      examId,
      score,
      correctCount,
      wrongCount,
      accuracy,
      answersProvided: answers
    });

    await result.save();

    res.status(200).json({
      success: true,
      message: 'Exam submitted successfully',
      score,
      correctCount,
      wrongCount,
      accuracy: accuracy.toFixed(2) + '%'
    });

  } catch (error) {
    console.error('Error submitting exam:', error);
    res.status(500).json({ success: false, message: 'Server error during exam submission.' });
  }
};