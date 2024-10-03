const getEmployees = async (req, res) => {
    try {
      const [rows] = await req.pool.query('SELECT id, fullName FROM psa_employee_details');
      res.status(200).json(rows);
    } catch (error) {
      console.error('Error fetching employees:', error);
      res.status(500).json({ message: 'Error fetching employees' });
    }
  };
  
  module.exports = { getEmployees };
  