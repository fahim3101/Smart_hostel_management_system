const express = require('express');
const router = express.Router();
const allocationController = require('../controllers/allocationController');
const auth = require('../middleware/auth');

router.post('/calculate-scores', auth('admin'), allocationController.calculateScores);
router.post('/run-allocation', auth('admin'), allocationController.runAllocation);
router.get('/result/:student_id', auth(), allocationController.getAllocationResult);
router.get('/admin/stats', auth('admin'), allocationController.getAdminStats);

module.exports = router;