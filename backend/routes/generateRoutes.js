const express = require('express');
const router = express.Router();
const generateController = require('../controllers/generateController');
const auth = require('../middleware/auth');

router.post('/students', auth('admin'), generateController.generateStudents);
router.get('/count', generateController.getStudentsCount);

module.exports = router;