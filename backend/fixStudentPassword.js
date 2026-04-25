const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const fixStudentPassword = async () => {
  try {
    const pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'hostel_management',
    });

    const connection = await pool.getConnection();

    // Generate correct hash for 'password123'
    const hashedPassword = await bcrypt.hash('password123', 10);

    console.log('Generated Hash:', hashedPassword);

    // Update ALL students with correct password
    const [result] = await connection.query(
      'UPDATE students SET password = ? WHERE 1=1',
      [hashedPassword]
    );

    console.log('✅ Updated', result.affectedRows, 'students');

    // Verify
    const [students] = await connection.query(
      'SELECT student_id, name, password FROM students LIMIT 3'
    );

    console.log('\n📋 Sample students:');
    console.log(students);

    connection.release();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

fixStudentPassword();