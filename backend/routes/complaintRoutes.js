const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaintController');
const auth = require('../middleware/auth');

router.post('/submit', auth('student'), complaintController.submitComplaint);
router.get('/', auth('admin'), complaintController.getAllComplaints);
router.put('/resolve/:complaint_id', auth('admin'), complaintController.resolveComplaint);

module.exports = router;