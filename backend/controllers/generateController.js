const pool = require('../config/db');
const bcrypt = require('bcryptjs');

const bangladeshiNames = {
  male: [
    'Md. Rafiq Ahmed', 'Karim Hassan', 'Tanvir Islam', 'Arif Khan', 'Bilal Ahmed',
    'Faisal Rahman', 'Habib Uddin', 'Jamal Hossain', 'Karim Mia', 'Lahir Ahmed',
    'Masud Rana', 'Nasir Uddin', 'Oved Rahman', 'Parvez Ahmed', 'Qaisar Khan',
    'Rasul Ahmed', 'Saiful Islam', 'Tahir Rahman', 'Usman Khan', 'Vahid Ahmed',
    'Wasim Khan', 'Xavier Ahmed', 'Yousuf Rahman', 'Zaman Mia', 'Akram Khan'
  ],
  female: [
    'Fatima Begum', 'Aisha Khan', 'Nasrin Akter', 'Rukhsana Islam', 'Shahnaz Akhter',
    'Tasneem Ahmed', 'Ummul Khair', 'Vandana Roy', 'Wasima Islam', 'Yasmin Khan',
    'Zahra Begum', 'Amina Sultana', 'Bushra Akhter', 'Camelia Begum', 'Delwar Akter',
    'Erina Khan', 'Farida Begum', 'Gulnar Akter', 'Hena Khan', 'Iqra Begum',
    'Jamila Begum', 'Kamela Khan', 'Lamia Ahmed', 'Mishita Akter', 'Nisa Begum'
  ]
};

exports.generateStudents = async (req, res) => {
  try {
    const connection = await pool.getConnection();

    // Check if students already exist
    const [existingStudents] = await connection.query('SELECT COUNT(*) as count FROM students');
    
    if (existingStudents[0].count > 0) {
      connection.release();
      return res.status(400).json({ message: 'Students already exist. Delete them first.' });
    }

    let studentCount = 0;
    const studentsPerBatch = 25;

    // Generate students for 4 batches
    for (let b = 1; b <= 4; b++) {
      for (let i = 1; i <= studentsPerBatch; i++) {
        const gender = Math.random() > 0.5 ? 'male' : 'female';
        const nameList = bangladeshiNames[gender];
        const randomName = nameList[Math.floor(Math.random() * nameList.length)];

        const student_id = `STU${String(2024000 + (b - 1) * 100 + i).padStart(5, '0')}`;
        const cgpa = (Math.random() * 1.5 + 2.5).toFixed(2); // 2.50 to 4.00
        const distance = Math.floor(Math.random() * 490 + 10); // 10 to 500 km
        const income = Math.floor(Math.random() * 95000 + 5000); // 5000 to 100000
        const special = Math.random() > 0.8 ? 1 : 0;
        const previous_stay = Math.random() > 0.6 ? 1 : 0;

        const hashedPassword = await bcrypt.hash('password123', 10);

        try {
          await connection.query(
            `INSERT INTO students (
              student_id, name, email, password, batch, gender, cgpa, 
              department, distance_from_home, family_income, 
              special_condition, previous_hostel_stay
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              student_id,
              randomName,
              `${student_id.toLowerCase()}@university.edu`,
              hashedPassword,
              b,
              gender,
              cgpa,
              'CSE',
              distance,
              income,
              special,
              previous_stay
            ]
          );
          studentCount++;
        } catch (err) {
          console.log(`Skipping duplicate: ${student_id}`);
        }
      }
    }

    connection.release();

    res.json({
      message: `✅ ${studentCount} students generated successfully!`,
      count: studentCount,
      defaultPassword: 'password123'
    });

  } catch (error) {
    console.error('Error generating students:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get all students count
exports.getStudentsCount = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [result] = await connection.query('SELECT COUNT(*) as count FROM students');
    connection.release();

    res.json({ count: result[0].count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};