const User = require('../models/User');
const Admission = require('../models/Admission');

const getStudentProfile = async (req, res) => {
  try {
    const studentId = req.user?.id || req.user?._id;
    const student = await User.findById(studentId).select('-password').lean();

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found.' });
    }

    const admission = await Admission.findOne({ email: student.email }).lean();

    return res.status(200).json({
      success: true,
      student,
      admission: admission || null
    });
  } catch (err) {
    console.error('Error fetching student profile:', err);
    return res.status(500).json({ success: false, message: 'Server error loading student profile.' });
  }
};

module.exports = {
  getStudentProfile
};