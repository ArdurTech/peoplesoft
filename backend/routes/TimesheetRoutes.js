const express = require('express');
const router = express.Router();
const { getAssignedTasksByEmployeeName, submitTimesheet } = require('../controllers/TimesheetController');

// Route to fetch assigned tasks by employee name
router.get('/assigned-tasks/:employee_name', getAssignedTasksByEmployeeName);

// Route to submit timesheet
router.post('/timesheet', submitTimesheet);

module.exports = router;
