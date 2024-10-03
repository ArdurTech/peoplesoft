const express = require('express');
const router = express.Router();
const TaskController = require('../controllers/TaskController');

// Route to fetch employees
router.get('/employees', TaskController.getEmployees);

// Route to fetch projects
router.get('/projects', TaskController.getProjects);

// Route to fetch tasks based on project name
router.get('/tasks/:projectName', TaskController.getTasks);

// Route to assign a task to an employee
router.post('/assign', TaskController.assignTask);

module.exports = router;
