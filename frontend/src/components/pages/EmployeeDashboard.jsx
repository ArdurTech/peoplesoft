import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EmployeeDashboard = () => {
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
                const response = await axios.get('/api/employees');
                console.log('Fetched employees:', response.data); // Log fetched employees
                setEmployees(response.data);
            } catch (error) {
                console.error('Error fetching employees:', error);
            }
        };

        const fetchProjects = async () => {
            try {
                const response = await axios.get('/api/projects');
                console.log('Fetched projects:', response.data); // Log fetched projects
                setProjects(response.data);
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };

        fetchEmployees();
        fetchProjects();
    }, []);

    useEffect(() => {
        const fetchTasks = async () => {
            if (selectedProject) {
                try {
                    const response = await axios.get(`/api/projects/${selectedProject}/tasks`);
                    console.log('Fetched tasks for project:', response.data); // Log fetched tasks
                    setTasks(response.data);
                } catch (error) {
                    console.error('Error fetching tasks:', error);
                }
            } else {
                setTasks([]); // Clear tasks if no project is selected
            }
        };

        fetchTasks();
    }, [selectedProject]);
   const handleAssignTask = async (e) => {
    e.preventDefault();
    
    // Use a known employee_id for testing
    const testEmployeeId = '1'; // Change this to an existing ID for testing

    try {
        await axios.post('/api/tasks/assign-task', {
            employee_id: testEmployeeId, // Use test employee ID
            project_id: selectedProject,
            task_id: selectedTask,
            assigned_date: assignedDate,
            due_date: dueDate,
        });
        alert('Task assigned successfully!');
        // Reset form fields
        setSelectedEmployee('');
        setSelectedProject('');
        setSelectedTask('');
        setAssignedDate('');
        setDueDate('');
    } catch (error) {
        console.error("Error assigning task:", error);
        if (error.response && error.response.status === 404) {
            alert("Employee not found.");
        } else {
            alert("Error assigning task. Please try again.");
        }
    }
};

    
    return (
        <div>
            <h1>Employee Dashboard</h1>
            <form onSubmit={handleAssignTask}>
                <div>
                    <label>Select Employee</label>
                    <select value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)}>
                        <option value="">Select an employee</option>
                        {employees.map((employee) => (
                            <option key={employee.id} value={employee.employee_id}>
                                {employee.fullName}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Select Project</label>
                    <select value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)}>
                        <option value="">Select a project</option>
                        {projects.map((project) => (
                            <option key={project.id} value={project.id}>
                                {project.project_name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Select Task</label>
                    <select value={selectedTask} onChange={(e) => setSelectedTask(e.target.value)} disabled={!selectedProject}>
                        <option value="">Select a task</option>
                        {tasks.map((task) => (
                            <option key={task.id} value={task.id}>
                                {task.task_name}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>Assigned Date</label>
                    <input type="date" value={assignedDate} onChange={(e) => setAssignedDate(e.target.value)} required />
                </div>
                <div>
                    <label>Due Date</label>
                    <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
                </div>
                <button type="submit">Assign Task</button>
            </form>
        </div>
    );
};

export default EmployeeDashboard;
