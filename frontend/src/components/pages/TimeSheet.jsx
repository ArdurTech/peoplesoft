import { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import styles from "../styles/Timesheet.module.css";

function Timesheet() {
  const [rows, setRows] = useState([
    { employee_name: "", project_name: "", task_name: "", assigned_date: "", due_date: "", date: "", worked_hours: 0, total_hours: 0 }
  ]);

  const [employees, setEmployees] = useState([]); // Store employees

  useEffect(() => {
    // Fetch employees from the server
    const fetchEmployees = async () => {
      try {
        const employeeResponse = await axios.get("http://psback.us-east-1.elasticbeanstalk.com/api/employees"); // Adjust endpoint as needed
        setEmployees(employeeResponse.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, []);

  const handleEmployeeNameChange = async (index, value) => {
    const newRows = [...rows];
    newRows[index].employee_name = value; // Storing employee name

    if (value) {
        try {
            const response = await axios.get(`http://psback.us-east-1.elasticbeanstalk.com/api/assigned-tasks/${value}`);
            const assignedTasks = response.data; // Getting all assigned tasks

            // Set project and task details from assignedTasks if found
            if (assignedTasks.length > 0) {
                const task = assignedTasks[0]; // Assuming you want the first assigned task
                newRows[index].project_name = task.project_name;
                newRows[index].task_name = task.task_name;

                // Convert assigned_date to local date
                const assignedDate = new Date(task.assigned_date);
                const dueDate = new Date(task.due_date);
                
                newRows[index].assigned_date = assignedDate.toLocaleDateString('en-CA'); // Format to yyyy-MM-dd
                newRows[index].due_date = dueDate.toLocaleDateString('en-CA'); // Format to yyyy-MM-dd
                
                newRows[index].date = new Date().toLocaleDateString('en-CA'); // Set today's date for the work
            }
        } catch (error) {
            console.error("Error fetching assigned tasks:", error);
        }
    }

    setRows(newRows);
};



  const handleChange = (index, event) => {
    const { name, value } = event.target; // Get name and value from the input

    const newRows = [...rows];
    newRows[index][name] = value; // Update the respective field
    setRows(newRows); // Update state
  };

  const handleAddRow = () => {
    setRows([...rows, { employee_name: "", project_name: "", task_name: "", assigned_date: "", due_date: "", date: "", worked_hours: 0, total_hours: 0 }]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate due date against assigned date
    for (const row of rows) {
      if (new Date(row.due_date) < new Date(row.assigned_date)) {
        toast.error("Due date cannot be before assigned date.");
        return;
      }
    }

    console.log("Submitting rows:", rows);
    try {
      const response = await axios.post("http://psback.us-east-1.elasticbeanstalk.com/api/timesheet", { rows });
      toast.success(response.data.message);

      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (error) {
      console.error("There was an error submitting the form!", error);
      toast.error("There was an error submitting the form.");
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Timesheet Entry</h1>
      </header>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Project Name</th>
                <th>Project Task</th>
                <th>Assigned Date</th>
                <th>Due Date</th>
                <th>Date</th>
                <th>Worked Hours</th>
                <th>Total Hours</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="text"
                      name="employee_name"
                      value={row.employee_name}
                      onChange={(e) => handleEmployeeNameChange(index, e.target.value)} // Update to handle employee name change
                      required
                    />
                  </td>
                  <td><input type="text" name="project_name" value={row.project_name} readOnly /></td>
                  <td><input type="text" name="task_name" value={row.task_name} readOnly /></td>
                  <td>
                    <input 
                      type="date" 
                      name="assigned_date" 
                      value={row.assigned_date} 
                      onChange={(e) => handleChange(index, e)} 
                      required 
                    />
                  </td>
                  <td>
                    <input 
                      type="date" 
                      name="due_date" 
                      value={row.due_date} 
                      onChange={(e) => handleChange(index, e)} 
                      required 
                    />
                  </td>
                  <td>
                    <input 
                      type="date" 
                      name="date" 
                      value={row.date} 
                      onChange={(e) => handleChange(index, e)} 
                      required 
                    />
                  </td>
                  <td>
                    <input 
                      type="number" 
                      name="worked_hours" 
                      value={row.worked_hours} 
                      onChange={(e) => handleChange(index, e)} 
                      required 
                    />
                  </td>
                  <td>
                    <input 
                      type="number" 
                      name="total_hours" 
                      value={row.total_hours} 
                      readOnly 
                    />
                  </td>
                  <td>
                    {index === rows.length - 1 && (
                      <button type="button" onClick={handleAddRow}>Add Row</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={styles.buttons}>
          <button type="submit">Submit</button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
}

export default Timesheet;
