const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const auth = require('../middleware/auth');

router.post('/submit', auth('student'), applicationController.submitApplication);
router.get('/status', auth('student'), applicationController.getApplicationStatus);

module.exports = router;