const express = require('express');
const router = express.Router();
const AttendanceController = require('../controllers/AttendanceController'); 

router.post('/', AttendanceController.handleLogin);  
router.post('/logout', AttendanceController.handleLogout); 

module.exports = router;
