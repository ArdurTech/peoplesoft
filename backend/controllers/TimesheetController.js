const getAssignedTasksByEmployeeName = async (req, res) => {
    const { employee_name } = req.params; // Getting employee_name from request parameters
  
    try {
        const query = `
            SELECT 
                projects.project_name, 
                tasks.task_name, 
                assigned_tasks.assigned_date AS assigned_date, 
                assigned_tasks.due_date AS due_date 
            FROM psa_assigned_tasks AS assigned_tasks
            JOIN psa_projects AS projects ON assigned_tasks.project_name = projects.project_name
            JOIN psa_tasks AS tasks ON assigned_tasks.task_name = tasks.task_name
            WHERE assigned_tasks.employee_name = ?`;
        
        const [rows] = await req.pool.query(query, [employee_name]);
        if (rows.length > 0) {
            res.status(200).json(rows);
        } else {
            res.status(404).json({ message: "No assigned tasks found for this employee." });
        }
    } catch (error) {
        console.error("Error fetching assigned tasks by employee name:", error);
        res.status(500).json({ message: "Error fetching assigned tasks." });
    }
  };
  
  const submitTimesheet = async (req, res) => {
    const { rows } = req.body; // Getting rows of timesheet data
  
    try {
        const insertQueries = rows.map(row => {
            return `
                INSERT INTO psa_timesheet (employee_name, project_name, task_name, assigned_date, due_date, date, worked_hours, total_hours)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;
        });
  
        for (let i = 0; i < rows.length; i++) {
            await req.pool.query(insertQueries[i], [
                rows[i].employee_name,  // Use employee_name
                rows[i].project_name,
                rows[i].task_name,
                rows[i].assigned_date,   // Use assigned_date
                rows[i].due_date,        // Use due_date
                rows[i].date,
                rows[i].worked_hours,
                rows[i].total_hours
            ]);
        }
  
        res.status(200).json({ message: "Timesheet submitted successfully" });
    } catch (error) {
        console.error("Error submitting timesheet:", error);
        res.status(500).json({ message: "Error submitting timesheet." });
    }
  };
  
  module.exports = { getAssignedTasksByEmployeeName, submitTimesheet };
  