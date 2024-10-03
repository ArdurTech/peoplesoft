const LeaveRequestController = async (req, res) => {
  const {
    firstName,
    lastName,
    employeeId,
    department,
    date,
    absenceType,
    reason,
    absenceFrom,
    absenceThrough,
    earlyLeaving,
    lateComing,
  } = req.body;

  // Check if all required fields are present
  if (
    !firstName || !lastName || !employeeId || !department ||
    !date || !absenceType || !reason
  ) {
    return res.status(400).json({ message: "All mandatory fields are required" });
  }

  // Insert query for inserting into the new table
  const query = `INSERT INTO psa_leave_requests 
    (firstName, lastName, employeeId, department, date, absenceType, reason, absenceFrom, absenceThrough, earlyLeaving, lateComing) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const values = [
    firstName,
    lastName,
    employeeId,
    department,
    date,
    absenceType,
    reason,
    absenceFrom || null,
    absenceThrough || null,
    earlyLeaving || null,
    lateComing || null
  ];

  try {
    await req.pool.query(query, values);
    res.status(200).json({ message: 'Leave request submitted successfully' });
  } catch (err) {
    console.error('Error inserting data:', err);
    res.status(500).json({ message: 'Failed to submit leave request' });
  }
};

module.exports = {
  LeaveRequestController,
};
