const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Student Login
exports.studentLogin = async (req, res) => {
  try {
    const { student_id, password } = req.body;

    if (!student_id || !password) {
      return res.status(400).json({ message: 'Student ID and password required' });
    }

    const connection = await pool.getConnection();
    const [students] = await connection.query(
      'SELECT * FROM students WHERE student_id = ?',
      [student_id]
    );
    connection.release();

    if (students.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const student = students[0];
    const isPasswordValid = await bcrypt.compare(password, student.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: student.student_id, role: 'student', name: student.name },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { student_id: student.student_id, name: student.name, role: 'student' },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin Login
exports.adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required' });
    }

    const connection = await pool.getConnection();
    const [admins] = await connection.query(
      'SELECT * FROM admins WHERE username = ?',
      [username]
    );
    connection.release();

    if (admins.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const admin = admins[0];
    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: admin.admin_id, role: 'admin', username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { admin_id: admin.admin_id, username: admin.username, role: 'admin' },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Authority Login
exports.authorityLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required' });
    }

    const connection = await pool.getConnection();
    const [authorities] = await connection.query(
      'SELECT * FROM authorities WHERE username = ?',
      [username]
    );
    connection.release();

    if (authorities.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const authority = authorities[0];
    const isPasswordValid = await bcrypt.compare(password, authority.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: authority.authority_id, role: 'authority', username: authority.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { authority_id: authority.authority_id, username: authority.username, role: 'authority' },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};