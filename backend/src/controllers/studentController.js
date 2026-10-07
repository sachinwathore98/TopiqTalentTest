const Admission = require('../models/Admission');
const User = require('../models/User');
const { processAutomaticCommissions } = require('./commissionEngine');

exports.verifyPublicAdmission = async (req, res) => {
  try {
    const {
      studentName, mobile, email, studentClass, school, parentDetails, address,
      examName, admissionAmount, franchiseId, asmId, coordinatorId,
      razorpay_order_id, razorpay_payment_id
    } = req.body;

    const amount = admissionAmount ? parseFloat(admissionAmount) : 1999;

    const count = await Admission.countDocuments();
    const admissionId = `TOPIQ-ADM-${String(count + 1).padStart(6, '0')}`;

    const newAdmission = new Admission({
      admissionId,
      studentName,
      mobile,
      email,
      studentClass,
      school: school || '',
      parentDetails: parentDetails || '',
      address: address || '',
      examName: examName || 'TOPIQ Talent Test',
      franchiseId: franchiseId || null,
      asmId: asmId || null,
      coordinatorId: coordinatorId || null,
      admissionAmount: amount,
      paymentStatus: 'Paid',
      paymentId: razorpay_payment_id || `PAY-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      paymentDate: new Date(),
      admissionStatus: 'Confirmed',
      settlementStatus: 'Pending'
    });

    await newAdmission.save();
    await processAutomaticCommissions(newAdmission._id);

    return res.status(201).json({
      success: true,
      message: `Direct public admission registered successfully! ID: ${admissionId}`,
      admission: newAdmission
    });
  } catch (err) {
    console.error('Error verifying public admission:', err);
    return res.status(500).json({ success: false, message: err.message || 'Error processing public admission.' });
  }
};