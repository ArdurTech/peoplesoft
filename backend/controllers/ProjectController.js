const getProjects = async (req, res) => {
  try {
      // Query to fetch projects from the database
      const [rows] = await req.pool.query('SELECT id, project_name FROM projects'); // Adjust the query as per your table structure
      
      // Respond with the fetched data
      res.status(200).json(rows);
  } catch (error) {
      // Log the error for debugging
      console.error('Error fetching projects:', error);
      
      // Respond with a 500 status and an error message
      res.status(500).json({ message: 'Error fetching projects' });
  }
};

const getTasksByProject = async (req, res) => {
  const { projectId } = req.params; // Changed to projectId for consistency

  try {
    const [rows] = await req.pool.query('SELECT id, task_name FROM tasks WHERE project_id = ?', [projectId]); // Adjust query to match your DB
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Error fetching tasks' });
  }
};

module.exports = { getProjects, getTasksByProject };
