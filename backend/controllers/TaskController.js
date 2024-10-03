const TaskController = {
    // Fetch all employees
    getEmployees: async (req, res) => {
      const pool = req.pool;
      try {
        const result = await pool.query('SELECT fullName AS employee_name FROM psa_employee_details');
        res.json(result[0]); // Return the rows array directly
      } catch (error) {
        console.error('Error fetching employees:', error);
        res.status(500).json({ error: 'Error fetching employees' });
      }
    },
  
    // Fetch all projects
    getProjects: async (req, res) => {
      const pool = req.pool;
      try {
        const result = await pool.query('SELECT project_name FROM psa_projects');
        res.json(result[0]); // Return the rows array directly
      } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ error: 'Error fetching projects' });
      }
    },
  
    // Fetch tasks based on project name
    getTasks: async (req, res) => {
      const { projectName } = req.params; // Extracting project name from route params
      const pool = req.pool; // Get pool from request
      try {
        const result = await pool.query('SELECT task_name FROM psa_tasks WHERE project_name = ?', [projectName]);
        res.json(result[0]); // Return the rows array directly
      } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'Error fetching tasks' });
      }
    },
  
    // Assign a task to an employee
    assignTask: async (req, res) => {
      const { employee_name, project_name, task_name, assigned_date, due_date } = req.body;
      const pool = req.pool; // Get pool from request
      try {
        const result = await pool.query(
          'INSERT INTO psa_assigned_tasks (employee_name, project_name, task_name, assigned_date, due_date) VALUES (?, ?, ?, ?, ?)',
          [employee_name, project_name, task_name, assigned_date, due_date]
        );
        res.status(201).json({ message: 'Task assigned successfully!' });
      } catch (error) {
        console.error('Error assigning task:', error);
        res.status(500).json({ error: 'Error assigning task' });
      }
    },
  };
  
  module.exports = TaskController;
  