const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/student-login', authController.studentLogin);
router.post('/admin-login', authController.adminLogin);
router.post('/authority-login', authController.authorityLogin);

module.exports = router;