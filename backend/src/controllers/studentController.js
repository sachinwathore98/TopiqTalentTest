const db = require('../config/db');
const { determineGroup, generateRollNumber } = require('../utils/helpers');

exports.registerStudent = async (req, res) => {
  const client = await db.connect();
  
  try {
    const { 
      full_name, guardian_phone, email, school_or_college, 
      grade_category, district, franchise_code, registration_fee, payment_mode, transaction_ref 
    } = req.body;

    await client.query('BEGIN');

    let franchiseId = null;
    if (franchise_code) {
      const fRes = await client.query('SELECT id FROM franchises WHERE branch_code = $1', [franchise_code]);
      if (fRes.rows.length > 0) franchiseId = fRes.rows[0].id;
    }

    const learningGroup = determineGroup(grade_category);
    const rollNumber = generateRollNumber();

    const studentQuery = `
      INSERT INTO students (topiq_roll_number, full_name, guardian_phone, email, school_or_college, grade_category, learning_group, district, assigned_franchise_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id, topiq_roll_number;
    `;
    const studentRes = await client.query(studentQuery, [
      rollNumber, full_name, guardian_phone, email, school_or_college, grade_category, learningGroup, district, franchiseId
    ]);

    const newStudent = studentRes.rows[0];
    const fee = parseFloat(registration_fee || 0);

    const paymentQuery = `
      INSERT INTO admission_payments (student_id, franchise_id, amount_paid, franchise_share_amount, company_share_amount, payment_mode, transaction_ref)
      VALUES ($1, $2, $3, $4, $5, $6, $7);
    `;
    await client.query(paymentQuery, [
      newStudent.id, franchiseId, fee, fee * 0.40, fee * 0.60, payment_mode || 'ONLINE', transaction_ref || `TXN-${Date.now()}`
    ]);

    if (franchiseId) {
      await client.query('UPDATE franchises SET active_students_count = active_students_count + 1 WHERE id = $1', [franchiseId]);
    }

    await client.query('COMMIT');

    res.status(201).json({
      success: true,
      message: 'Student registered successfully for TTT 100-Day Challenge.',
      data: {
        roll_number: newStudent.topiq_roll_number,
        group: learningGroup,
        daily_exam_time: '8:00 PM - 8:40 PM'
      }
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Registration Error:', error);
    res.status(500).json({ success: false, message: 'Registration failed.' });
  } finally {
    client.release();
  }
};