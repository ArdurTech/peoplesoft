const express = require('express');
const { getProjects, getTasksByProject } = require('../controllers/ProjectController');

const router = express.Router();

// Route to fetch all projects
router.get('/', getProjects);

// Route to fetch tasks by project ID (use projectId for consistency)
router.get('/:projectId/tasks', getTasksByProject);

module.exports = router;
