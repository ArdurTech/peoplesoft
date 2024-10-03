const mysql = require("mysql2/promise");

const DBConn = async () => {
  try {
    const pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    // Create database if it doesn't exist
    await pool.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_DATABASE}\``);
    console.log(`Database ${process.env.DB_DATABASE} created`);

    // Switch to the database
    await pool.query(`USE \`${process.env.DB_DATABASE}\``);
    console.log(`Switched to ${process.env.DB_DATABASE}`);

    // Create psa_users table
    await pool.query(`CREATE TABLE IF NOT EXISTS \`psa_users\` (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(50) NOT NULL UNIQUE,
      email VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      employee_id VARCHAR(255) NOT NULL UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      otp VARCHAR(6),
      otp_expiry DATETIME
    )`);
    console.log(`psa_users table created`);

    // Create psa_employee_details table
    await pool.query(`CREATE TABLE IF NOT EXISTS \`psa_employee_details\` (
      id INT AUTO_INCREMENT PRIMARY KEY,
      employee_id VARCHAR(255) NOT NULL,
      fullName VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      gender ENUM('Male', 'Female', 'Other') NOT NULL,
      aadhaar VARCHAR(12) NOT NULL UNIQUE,
      pan VARCHAR(10) NOT NULL UNIQUE,
      local_address TEXT NOT NULL,
      permanent_address TEXT NOT NULL,
      age INT NOT NULL,
      education VARCHAR(255) NOT NULL,
      contact_no VARCHAR(15) NOT NULL,
      emergency_contact VARCHAR(15) NOT NULL,
      blood_group VARCHAR(5),
      birth_date DATE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (employee_id) REFERENCES psa_users(employee_id)
    )`);
    console.log(`psa_employee_details table created`);

    // Create projects table
    await pool.query(`CREATE TABLE IF NOT EXISTS \`psa_projects\` (
      id INT AUTO_INCREMENT PRIMARY KEY,
      project_name VARCHAR(255) NOT NULL UNIQUE,
      project_description TEXT,
      start_date DATE,
      end_date DATE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`);
    console.log(`psa_projects table created`);

    // Create tasks table
    await pool.query(`CREATE TABLE IF NOT EXISTS \`psa_tasks\` (
      id INT AUTO_INCREMENT PRIMARY KEY,
      project_name VARCHAR(255) NOT NULL,
      task_name VARCHAR(255) NOT NULL,
      task_description TEXT,
      start_date DATE,
      end_date DATE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`);
    console.log(`psa_tasks table created`);

    // Create psa_timesheet table
    await pool.query(`CREATE TABLE IF NOT EXISTS \`psa_timesheet\` (
       id INT AUTO_INCREMENT PRIMARY KEY,
    employee_name VARCHAR(255) NOT NULL,
    project_name VARCHAR(255) NOT NULL,
    task_name VARCHAR(255) NOT NULL,
    assigned_date DATE NOT NULL,
    due_date DATE NOT NULL,
    date DATE NOT NULL,
    worked_hours DECIMAL(5, 2) NOT NULL,
    total_hours DECIMAL(5, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);
    console.log(`psa_timesheet table created`);

    // Create psa_attendance table
    await pool.query(`CREATE TABLE IF NOT EXISTS \`psa_attendance\` (
      id INT AUTO_INCREMENT PRIMARY KEY,
      employee_id VARCHAR(255) NOT NULL,
      work_mode ENUM('Work from Home', 'Work from Office', 'Work from Client Location') NOT NULL,
      login_time DATETIME NOT NULL,
      logout_time DATETIME,
      worked_hours DECIMAL(5, 2),
      ip_address VARCHAR(45),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`);
    console.log(`psa_attendance table created`);

    // Create psa_leave_requests table
    await pool.query(`CREATE TABLE IF NOT EXISTS \`psa_leave_requests\` (
      id INT AUTO_INCREMENT PRIMARY KEY,
      firstName VARCHAR(255) NOT NULL,
      lastName VARCHAR(255) NOT NULL,
      employeeId VARCHAR(255) NOT NULL,
      department VARCHAR(255) NOT NULL,
      date DATE NOT NULL,
      absenceType TEXT NOT NULL,
      reason TEXT,
      absenceFrom DATE,
      absenceThrough DATE,
      earlyLeaving TIME,
      lateComing TIME
    )`);
    console.log(`psa_leave_requests table created`);

    // Create assigned_tasks table
    await pool.query(`CREATE TABLE IF NOT EXISTS \`psa_assigned_tasks\` (
      id INT AUTO_INCREMENT PRIMARY KEY,
      employee_name VARCHAR(255) NOT NULL,
      project_name VARCHAR(255) NOT NULL,
      task_name VARCHAR(255) NOT NULL,
      assigned_date DATE NOT NULL,
      due_date DATE,
      status ENUM('Pending', 'In Progress', 'Completed') DEFAULT 'Pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`);
    console.log(`psa_assigned_tasks table created`);

    return pool;

  } catch (error) {
    console.error("Error during database connection:", error);
    throw error;
  }
};

module.exports = DBConn;
