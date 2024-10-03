const bcrypt = require("bcryptjs"); // for hashing user's password
const token = require("../utils/jwt"); // utility for generating JWT
const { sendEmail } = require("../utils/email"); // utility for sending emails
const crypto = require("crypto"); // for generating unique employee IDs

// Helper function to generate unique employee ID
const generateEmployeeId = async (req) => {
  let newId;
  let isUnique = false;

  // Start from 181000
  let startingId = 1000;

  while (!isUnique) {
    // Generate a new employee ID
    newId = `AT${startingId++}`;

    // Check if this ID already exists in the database
    const [existingId] = await req.pool.query(`SELECT COUNT(*) AS count FROM psa_users WHERE employee_id = ?`, [newId]);

    // If the count is zero, it means the ID is unique
    if (existingId[0].count === 0) {
      isUnique = true;
    }
  }

  return newId;
};

// Helper function to validate email format
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Helper function to validate password
const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
  return passwordRegex.test(password);
};

const SignUpController = async (req, res) => {
  const { username, email, password } = req.body;

  // Validate inputs
  if (!username || !email || !password) {
    return res.status(400).send("All fields are required");
  }

  // Password criteria
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/; // At least 1 uppercase, 1 number, 8 characters
  if (!passwordRegex.test(password)) {
    return res.status(400).send("Password must be at least 8 characters long, contain at least one uppercase letter and one number.");
  }

  // Email criteria
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email validation
  if (!emailRegex.test(email)) {
    return res.status(400).send("Please enter a valid email address.");
  }

  try {
    // Check if username already exists
    const [checkUsername] = await req.pool.query(
      `SELECT COUNT(*) AS count FROM psa_users WHERE username = ?`,
      [username]
    );
    if (checkUsername[0].count > 0) {
      return res.status(400).send("User with the same username already exists");
    }

    // Check if email already exists
    const [checkEmail] = await req.pool.query(
      `SELECT COUNT(*) AS count FROM psa_users WHERE email = ?`,
      [email]
    );
    if (checkEmail[0].count > 0) {
      return res.status(400).send("User with the same email already exists");
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate a unique Employee ID
    const employeeId = await generateEmployeeId(req);

    // Insert new user into the database
    const [insertUser] = await req.pool.query(
      `INSERT INTO psa_users (username, email, password, employee_id) VALUES (?, ?, ?, ?)`,
      [username, email, hashedPassword, employeeId]
    );

    // Send Employee ID to the user via email
    await sendEmail(email, "Your Login ID", `Your Login ID is ${employeeId}`);

    // Send success response with user details
    res.status(201).json({ id: insertUser.insertId, username, email, employeeId });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).send("Internal Server Error");
  }
};


const LoginController = async (req, res) => {
  const { password, employeeId } = req.body;

  // Validate inputs
  if (!password || !employeeId) {
    return res.status(400).send("Employee ID and Password are required");
  }

  try {
    // Check if user exists by employee ID
    const [checkUser] = await req.pool.query(
      `SELECT * FROM psa_users WHERE employee_id = ?`,
      [employeeId]
    );

    // If no user is found
    if (checkUser.length === 0) {
      return res.status(404).send("User with this Employee ID doesn't exist");
    }

    // Get user details
    const foundUser = checkUser[0];

    // Check if employee details are filled out
    const [checkEmployeeDetails] = await req.pool.query(
      `SELECT * FROM psa_employee_details WHERE employee_id = ?`,
      [employeeId]
    );

    // If employee details are not filled out
    if (checkEmployeeDetails.length === 0) {
      return res.status(403).send("Please fill out your employee details before logging in.");
    }

    // Compare provided password with stored hashed password
    const matchPassword = await bcrypt.compare(password, foundUser.password);
    if (!matchPassword) {
      return res.status(401).send("Incorrect password");
    }

    // Generate and send JWT
    token(foundUser, res);
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send("Internal Server Error");
  }
};



// Export all controllers in a single module.exports statement
module.exports = { SignUpController, LoginController };
