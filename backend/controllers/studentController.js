const pool = require('../config/db');

// Get all students
exports.getAllStudents = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [students] = await connection.query('SELECT * FROM students');
    connection.release();

    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get student by ID
exports.getStudentById = async (req, res) => {
  try {
    const { student_id } = req.params;
    const connection = await pool.getConnection();
    const [students] = await connection.query(
      'SELECT * FROM students WHERE student_id = ?',
      [student_id]
    );
    connection.release();

    if (students.length === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json(students[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get student dashboard data
exports.getDashboard = async (req, res) => {
  try {
    const student_id = req.user.id;
    const connection = await pool.getConnection();

    // Get student details
    const [students] = await connection.query(
      'SELECT * FROM students WHERE student_id = ?',
      [student_id]
    );

    // Get application status
    const [applications] = await connection.query(
      'SELECT * FROM applications WHERE student_id = ? ORDER BY applied_at DESC LIMIT 1',
      [student_id]
    );

    // Get priority score
    const [scores] = await connection.query(
      'SELECT * FROM priority_scores WHERE student_id = ?',
      [student_id]
    );

    // Get allocation if exists
    const [allocations] = await connection.query(
      'SELECT a.*, r.room_number, h.hostel_name FROM allocations a JOIN rooms r ON a.room_id = r.room_id JOIN hostels h ON a.hostel_id = h.hostel_id WHERE a.student_id = ?',
      [student_id]
    );

    connection.release();

    res.json({
      student: students[0],
      application: applications[0] || null,
      score: scores[0] || null,
      allocation: allocations[0] || null,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};