const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const auth = require('../middleware/auth');

router.get('/', auth(), studentController.getAllStudents);
router.get('/dashboard', auth('student'), studentController.getDashboard);
router.get('/:student_id', auth(), studentController.getStudentById);

module.exports = router;