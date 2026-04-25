const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const testLogin = async () => {
  try {
    const pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'hostel_management',
    });

    const connection = await pool.getConnection();

    // Get first student
    const [students] = await connection.query(
      'SELECT * FROM students LIMIT 1'
    );

    if (students.length === 0) {
      console.log('❌ No students found!');
      connection.release();
      process.exit(1);
    }

    const student = students[0];
    console.log('📋 Student Found:');
    console.log('ID:', student.student_id);
    console.log('Name:', student.name);
    console.log('Email:', student.email);
    console.log('Current Password Hash:', student.password);

    // Test password match
    const testPassword = 'password123';
    const isMatch = await bcrypt.compare(testPassword, student.password);
    
    console.log('\n🔐 Password Test:');
    console.log('Test Password:', testPassword);
    console.log('Hash Match:', isMatch ? '✅ YES' : '❌ NO');

    // If not match, generate new hash and update
    if (!isMatch) {
      console.log('\n⚠️ Password not matching! Fixing...');
      const newHash = await bcrypt.hash(testPassword, 10);
      
      await connection.query(
        'UPDATE students SET password = ? WHERE student_id = ?',
        [newHash, student.student_id]
      );

      console.log('✅ Password updated!');
      console.log('New Hash:', newHash);
    }

    connection.release();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

testLogin();