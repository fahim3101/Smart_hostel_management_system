const pool = require('../config/db');

// Submit complaint
exports.submitComplaint = async (req, res) => {
  try {
    const { title, description } = req.body;
    const student_id = req.user.id;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description required' });
    }

    const connection = await pool.getConnection();
    await connection.query(
      'INSERT INTO complaints (student_id, title, description) VALUES (?, ?, ?)',
      [student_id, title, description]
    );
    connection.release();

    res.json({ message: 'Complaint submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all complaints
exports.getAllComplaints = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [complaints] = await connection.query(
      'SELECT c.*, s.name FROM complaints c JOIN students s ON c.student_id = s.student_id ORDER BY c.created_at DESC'
    );
    connection.release();

    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Resolve complaint
exports.resolveComplaint = async (req, res) => {
  try {
    const { complaint_id } = req.params;
    const connection = await pool.getConnection();

    await connection.query(
      'UPDATE complaints SET status = ?, resolved_at = CURRENT_TIMESTAMP WHERE complaint_id = ?',
      ['resolved', complaint_id]
    );
    connection.release();

    res.json({ message: 'Complaint resolved' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};