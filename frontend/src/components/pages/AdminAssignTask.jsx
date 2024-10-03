import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/AdminAssignTask.css'; // Importing the CSS file

const AdminAssignTask = () => {
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedTask, setSelectedTask] = useState('');
  const [assignedDate, setAssignedDate] = useState('');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get('/api/tasks/employees');
        setEmployees(res.data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    const fetchProjects = async () => {
      try {
        const res = await axios.get('/api/tasks/projects');
        setProjects(res.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchEmployees();
    fetchProjects();
  }, []);

  const handleProjectChange = async (event) => {
    const projectName = event.target.value;
    setSelectedProject(projectName);
    try {
      const res = await axios.get(`/api/tasks/tasks/${projectName}`);
      setTasks(res.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const assignedDateObj = new Date(assignedDate);
    const dueDateObj = new Date(dueDate);

    if (dueDateObj < assignedDateObj) {
      alert('Error: Select valid Due Date.');
      return;
    }

    try {
      await axios.post('/api/tasks/assign', {
        employee_name: selectedEmployee,
        project_name: selectedProject,
        task_name: selectedTask,
        assigned_date: assignedDate,
        due_date: dueDate,
      });
      alert('Task assigned successfully!');
    } catch (error) {
      console.error('Error assigning task:', error);
      alert('Error assigning task. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <h2>Assign Task</h2>
      <div className="table">
        <div className="table-row">
          <div className="table-cell">
            <label>
              Employee Name:
              <select value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)}>
                <option value="">Select Employee</option>
                {employees.map((employee) => (
                  <option key={employee.employee_name} value={employee.employee_name}>
                    {employee.employee_name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="table-cell">
            <label>
              Project Name:
              <select value={selectedProject} onChange={handleProjectChange}>
                <option value="">Select Project</option>
                {projects.map((project) => (
                  <option key={project.project_name} value={project.project_name}>
                    {project.project_name}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
        <div className="table-row">
          <div className="table-cell">
            <label>
              Task Name:
              <select value={selectedTask} onChange={(e) => setSelectedTask(e.target.value)}>
                <option value="">Select Task</option>
                {tasks.map((task) => (
                  <option key={task.task_name} value={task.task_name}>
                    {task.task_name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="table-cell">
            <label>
              Assigned Date:
              <input
                type="date"
                value={assignedDate}
                onChange={(e) => setAssignedDate(e.target.value)}
                required
              />
            </label>
          </div>
        </div>
        <div className="table-row">
          <div className="table-cell">
            <label>
              Due Date:
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
            </label>
          </div>
          <div className="table-cell">
            <button type="submit">Add Assign Task</button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default AdminAssignTask;
