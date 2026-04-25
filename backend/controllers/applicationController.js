const pool = require('../config/db');

// Submit application
exports.submitApplication = async (req, res) => {
  try {
    const student_id = req.user.id;

    if (!student_id) {
      return res.status(400).json({ message: 'Student ID not found' });
    }

    const connection = await pool.getConnection();

    // Check if student exists
    const [students] = await connection.query(
      'SELECT * FROM students WHERE student_id = ?',
      [student_id]
    );

    if (students.length === 0) {
      connection.release();
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check if already applied
    const [existingApp] = await connection.query(
      'SELECT * FROM applications WHERE student_id = ?',
      [student_id]
    );

    if (existingApp.length > 0) {
      connection.release();
      return res.status(400).json({ message: 'Already applied for hostel' });
    }

    // Insert application
    await connection.query(
      'INSERT INTO applications (student_id, status) VALUES (?, ?)',
      [student_id, 'pending']
    );

    connection.release();

    res.json({ message: '✅ Application submitted successfully' });
  } catch (error) {
    console.error('Error submitting application:', error);
    res.status(500).json({ message: error.message });
  }
};

// Check application status
exports.getApplicationStatus = async (req, res) => {
  try {
    const student_id = req.user.id;
    const connection = await pool.getConnection();

    const [applications] = await connection.query(
      'SELECT * FROM applications WHERE student_id = ?',
      [student_id]
    );

    connection.release();

    res.json(applications[0] || null);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};