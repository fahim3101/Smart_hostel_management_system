const pool = require('../config/db');

// Calculate priority scores
exports.calculateScores = async (req, res) => {
  try {
    const connection = await pool.getConnection();

    // Get allocation rules
    const [rules] = await connection.query('SELECT * FROM allocation_rules LIMIT 1');
    const rule = rules[0];

    // Get all students with pending applications
    const [applications] = await connection.query(
      'SELECT DISTINCT s.* FROM students s INNER JOIN applications a ON s.student_id = a.student_id WHERE a.status = "pending"'
    );

    for (const student of applications) {
      // Normalize values
      const cgpaScore = (student.cgpa / 4) * 100;
      const distanceScore = (student.distance_from_home / 500) * 100;
      const incomeScore = (student.family_income / 100000) * 100;
      const specialScore = student.special_condition * 100;
      const previousScore = student.previous_hostel_stay * 100;

      // Calculate weighted score
      const totalScore =
        (cgpaScore * rule.cgpa_weight) / 100 +
        (distanceScore * rule.distance_weight) / 100 +
        (incomeScore * rule.income_weight) / 100 +
        (specialScore * rule.special_condition_weight) / 100 +
        (previousScore * rule.previous_stay_weight) / 100;

      // Insert or update score
      await connection.query(
        'INSERT INTO priority_scores (student_id, priority_score) VALUES (?, ?) ON DUPLICATE KEY UPDATE priority_score = ?, calculated_at = CURRENT_TIMESTAMP',
        [student.student_id, totalScore.toFixed(2), totalScore.toFixed(2)]
      );
    }

    connection.release();
    res.json({ message: 'Priority scores calculated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Run allocation
exports.runAllocation = async (req, res) => {
  try {
    const connection = await pool.getConnection();

    // First calculate scores
    const [rules] = await connection.query('SELECT * FROM allocation_rules LIMIT 1');
    const rule = rules[0];

    const [applications] = await connection.query(
      'SELECT DISTINCT s.* FROM students s INNER JOIN applications a ON s.student_id = a.student_id WHERE a.status = "pending"'
    );

    for (const student of applications) {
      const cgpaScore = (student.cgpa / 4) * 100;
      const distanceScore = (student.distance_from_home / 500) * 100;
      const incomeScore = (student.family_income / 100000) * 100;
      const specialScore = student.special_condition * 100;
      const previousScore = student.previous_hostel_stay * 100;

      const totalScore =
        (cgpaScore * rule.cgpa_weight) / 100 +
        (distanceScore * rule.distance_weight) / 100 +
        (incomeScore * rule.income_weight) / 100 +
        (specialScore * rule.special_condition_weight) / 100 +
        (previousScore * rule.previous_stay_weight) / 100;

      await connection.query(
        'INSERT INTO priority_scores (student_id, priority_score) VALUES (?, ?) ON DUPLICATE KEY UPDATE priority_score = ?',
        [student.student_id, totalScore.toFixed(2), totalScore.toFixed(2)]
      );
    }

    // Get ranked students
    const [rankedStudents] = await connection.query(`
      SELECT ps.*, s.gender FROM priority_scores ps
      JOIN students s ON ps.student_id = s.student_id
      WHERE ps.student_id IN (SELECT student_id FROM applications WHERE status = 'pending')
      ORDER BY ps.priority_score DESC
    `);

    // Get available seats
    const [availableSeats] = await connection.query(`
      SELECT s.seat_id, s.room_id, r.hostel_id, h.hostel_name, r.room_number 
      FROM seats s 
      JOIN rooms r ON s.room_id = r.room_id 
      JOIN hostels h ON r.hostel_id = h.hostel_id 
      WHERE s.is_available = 1
      ORDER BY h.hostel_id, r.room_id, s.seat_id
    `);

    let seatIndex = 0;

    for (const student of rankedStudents) {
      if (seatIndex < availableSeats.length) {
        const seat = availableSeats[seatIndex];

        // Insert allocation
        await connection.query(
          'INSERT INTO allocations (student_id, seat_id, hostel_id, room_id) VALUES (?, ?, ?, ?)',
          [student.student_id, seat.seat_id, seat.hostel_id, seat.room_id]
        );

        // Mark seat as unavailable
        await connection.query(
          'UPDATE seats SET is_available = 0 WHERE seat_id = ?',
          [seat.seat_id]
        );

        // Update application status
        await connection.query(
          'UPDATE applications SET status = ? WHERE student_id = ?',
          ['allocated', student.student_id]
        );

        seatIndex++;
      } else {
        // Add to waiting list
        await connection.query(
          'INSERT INTO waiting_list (student_id, priority_score) VALUES (?, ?)',
          [student.student_id, student.priority_score]
        );

        await connection.query(
          'UPDATE applications SET status = ? WHERE student_id = ?',
          ['waiting', student.student_id]
        );
      }
    }

    connection.release();
    res.json({ message: 'Allocation completed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get allocation result
exports.getAllocationResult = async (req, res) => {
  try {
    const { student_id } = req.params;
    const connection = await pool.getConnection();

    const [allocations] = await connection.query(`
      SELECT a.*, r.room_number, h.hostel_name, h.location, s.seat_number
      FROM allocations a
      JOIN rooms r ON a.room_id = r.room_id
      JOIN hostels h ON a.hostel_id = h.hostel_id
      JOIN seats s ON a.seat_id = s.seat_id
      WHERE a.student_id = ?
    `, [student_id]);

    const [waitings] = await connection.query(
      'SELECT * FROM waiting_list WHERE student_id = ?',
      [student_id]
    );

    connection.release();

    res.json({
      allocation: allocations[0] || null,
      waiting: waitings[0] || null,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get admin dashboard stats
exports.getAdminStats = async (req, res) => {
  try {
    const connection = await pool.getConnection();

    const [totalStudents] = await connection.query('SELECT COUNT(*) as count FROM students');
    const [totalApplications] = await connection.query('SELECT COUNT(*) as count FROM applications');
    const [allocatedStudents] = await connection.query('SELECT COUNT(*) as count FROM allocations');
    const [waitingList] = await connection.query('SELECT COUNT(*) as count FROM waiting_list');
    const [availableSeats] = await connection.query('SELECT COUNT(*) as count FROM seats WHERE is_available = 1');
    const [openComplaints] = await connection.query('SELECT COUNT(*) as count FROM complaints WHERE status = "open"');

    connection.release();

    res.json({
      totalStudents: totalStudents[0].count,
      totalApplications: totalApplications[0].count,
      allocatedStudents: allocatedStudents[0].count,
      waitingList: waitingList[0].count,
      availableSeats: availableSeats[0].count,
      openComplaints: openComplaints[0].count,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};