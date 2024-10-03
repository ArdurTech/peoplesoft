const express = require("express");
const app = express();
const cors = require('cors');
const DBConn = require("./config/DBConn");
const EmployeeRoutes = require("./routes/EmployeeRoutes"); 
const TimesheetRoutes = require('./routes/TimesheetRoutes');
const AttendanceRoutes = require("./routes/AttendanceRoutes");
const leaveRequestRoutes = require('./routes/leaveRequestRoutes');
const passwordRoutes = require('./routes/PasswordRoutes');
const chatRoutes = require('./routes/ChatRoutes');
const taskRoutes = require("./routes/tasks"); // Correctly named
const projectRoutes = require('./routes/project');
const employeeRoutes = require('./routes/employee');
// Import password routes

require("dotenv").config();
const port = process.env.PORT || 5000;

app.use(cors());

// Use express.json() to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRouter = require("./routes/AuthRoutes");

let pool; // Initialize the database connection pool

(async () => {
  try {
    pool = await DBConn();

    app.use((req, res, next) => {
      req.pool = pool;
      next();
    });

    // Use the auth routes with the /auth prefix
    app.use("/auth", authRouter);

    // Use the employee routes with the /api prefix
    app.use("/api", EmployeeRoutes);
    app.use("/api", TimesheetRoutes);
    app.use("/api/attendance", AttendanceRoutes);
    app.use('/api', leaveRequestRoutes);
    app.use('/api/password', passwordRoutes);
    app.use('/', chatRoutes);
    app.use('/api/projects', projectRoutes);  // Route for projects and tasks
    app.use('/api/employees', employeeRoutes); 
    app.use('/api/tasks', taskRoutes);   // Fixed: Corrected the variable name

    // Start the server on the specified port
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Error initializing server:", error);
  }
})();
