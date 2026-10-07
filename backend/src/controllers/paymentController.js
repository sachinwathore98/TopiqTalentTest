const Admission = require('../models/Admission');
const User = require('../models/User');
const { processAutomaticCommissions } = require('./commissionEngine');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const verifyAndRegisterPublicStudent = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userData } = req.body;

    if (!userData || !userData.email || !userData.name) {
      return res.status(400).json({ success: false, message: 'Missing required user parameters.' });
    }

    const studentName = userData.name;
    const mobile = userData.phone || userData.mobile;
    const email = userData.email.toLowerCase().trim();
    const studentClass = userData.studentClass || 'Class 8';
    const amount = userData.registrationFee ? parseFloat(userData.registrationFee) : 1999;

    let existingUser = await User.findOne({ email });
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(userData.password || 'Topiq@123', 10);
      existingUser = new User({
        name: studentName,
        email,
        password: hashedPassword,
        phone: mobile,
        role: 'student',
        studentClass,
        city: userData.city || '',
        district: userData.district || '',
        state: userData.state || 'Maharashtra',
        pincode: userData.pincode || '',
        is_paid: true,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id
      });
      await existingUser.save();
    }

    let existingAdmission = await Admission.findOne({ paymentId: razorpay_payment_id });
    if (!existingAdmission) {
      const count = await Admission.countDocuments();
      const admissionId = `TOPIQ-ADM-${String(count + 1).padStart(6, '0')}`;

      existingAdmission = new Admission({
        admissionId,
        studentName,
        mobile,
        email,
        studentClass,
        school: userData.school || '',
        parentDetails: userData.parentDetails || '',
        address: userData.address || '',
        examName: 'TOPIQ Talent Test',
        franchiseId: userData.assignedFranchise || null,
        asmId: userData.assignedASM || null,
        coordinatorId: null, // Public website direct registration
        admissionAmount: amount,
        paymentStatus: 'Paid',
        paymentId: razorpay_payment_id,
        paymentDate: new Date(),
        admissionStatus: 'Confirmed',
        settlementStatus: 'Pending'
      });

      await existingAdmission.save();

      try {
        await processAutomaticCommissions(existingAdmission._id);
      } catch (commErr) {
        console.error('Commission engine sync note:', commErr);
      }
    }

    const tokenPayload = {
      id: existingUser._id,
      email: existingUser.email,
      role: existingUser.role
    };

    const token = jwt.sign(
      tokenPayload, 
      process.env.JWT_SECRET || 'topiq_secret_key_2026', 
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      success: true,
      message: `Public student registered successfully! ID: ${existingAdmission.admissionId}`,
      token,
      role: existingUser.role,
      admission: existingAdmission
    });
  } catch (err) {
    console.error('Error in verifyAndRegisterPublicStudent:', err);
    return res.status(500).json({ success: false, message: err.message || 'Error processing registration.' });
  }
};

module.exports = {
  verifyAndRegisterPublicStudent
};