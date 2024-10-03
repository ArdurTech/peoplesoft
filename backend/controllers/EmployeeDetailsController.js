const EmployeeDetailsController = async (req, res) => {
  const {
    employee_id,
    fullName,
    email,
    gender,
    aadhaar,
    pan,
    local_address,
    permanent_address,
    age, // Get age as is (could be a string)
    education,
    contact_no,
    emergency_contact,
    blood_group,
    birth_date
  } = req.body;

  // Validate inputs
  if (
    !employee_id ||
    !fullName ||
    !email ||
    !gender ||
    !aadhaar ||
    !pan ||
    !local_address ||
    !permanent_address ||
    !age ||
    !education ||
    !contact_no ||
    !emergency_contact ||
    !blood_group ||
    !birth_date
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Convert age to an integer
  const ageInt = parseInt(age, 10);

  // Validate that age is a positive integer
  if (!Number.isInteger(ageInt) || ageInt <= 0) {
    return res.status(400).json({ message: "Age must be a positive integer" });
  }

  if (!/^\d{12}$/.test(aadhaar)) {
    return res.status(400).json({ message: "Aadhaar must be a 12-digit number" });
  }

  if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan)) {
    return res.status(400).json({ message: "PAN must be in the format AAAAA9999A" });
  }

  if (!/^\d{10}$/.test(contact_no)) {
    return res.status(400).json({ message: "Contact number must be a 10-digit number" });
  }

  if (!/^\d{10}$/.test(emergency_contact)) {
    return res.status(400).json({ message: "Emergency contact number must be a 10-digit number" });
  }

  try {
    const pool = req.pool;

    // Check if email, aadhaar, or employee_id already exists
    const [existingEmployee] = await pool.query(
      `SELECT * FROM psa_employee_details WHERE email = ? OR aadhaar = ? OR employee_id = ?`,
      [email, aadhaar, employee_id]
    );

    if (existingEmployee.length > 0) {
      return res
        .status(409)
        .json({ message: "Employee details with this email, Aadhaar, or Employee ID already exist" });
    }

    // Insert the new employee details
    const [result] = await pool.query(
      `INSERT INTO psa_employee_details (employee_id, fullName, email, gender, aadhaar, pan, local_address, permanent_address, age, education, contact_no, emergency_contact, blood_group, birth_date) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [employee_id, fullName, email, gender, aadhaar, pan, local_address, permanent_address, ageInt, education, contact_no, emergency_contact, blood_group, birth_date]
    );

    console.log("Employee details successfully inserted:", result);
    res.status(201).json({
      message: "Employee details added successfully",
      data: result,
    });

  } catch (error) {
    console.error("Error adding employee details:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  EmployeeDetailsController,
};
