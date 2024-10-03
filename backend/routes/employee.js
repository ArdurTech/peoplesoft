// routes/employee.js
const express = require('express');
const { getEmployees } = require('../controllers/EmployeeController');

const router = express.Router();

// Route to fetch all employees
router.get('/', getEmployees);

module.exports = router;
