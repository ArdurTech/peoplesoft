const express = require('express');
const { LeaveRequestController } = require('../controllers/LeaveRequestController'); // Ensure correct path

const router = express.Router();

// POST route for leave requests
router.post('/leave-requests', LeaveRequestController);

module.exports = router;
