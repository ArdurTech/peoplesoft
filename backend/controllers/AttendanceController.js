const handleLogin = (req, res) => {
    const { employeeId, workMode, loginTime, ipAddress } = req.body;

    if (!employeeId || !workMode || !loginTime) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const insertQuery = 'INSERT INTO psa_attendance (employee_id, work_mode, login_time, ip_address) VALUES (?, ?, ?, ?)';
    req.pool.query(insertQuery, [employeeId, workMode, loginTime, ipAddress], (error, results) => {
        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({ message: 'Database error' });
        }
        res.status(200).json({ success: true, message: 'Logged in successfully' });
    });
};

const handleLogout = async (req, res) => {
    const { logoutTime } = req.body;

    if (!logoutTime) {
        return res.status(400).json({ message: 'Logout time is required' });
    }

    try {
        // Find the most recent login record without a logout time
        const [selectResults] = await req.pool.query(`
            SELECT id, login_time FROM psa_attendance
            WHERE logout_time IS NULL
            ORDER BY login_time DESC
            LIMIT 1
        `);

        if (selectResults.length === 0) {
            return res.status(404).json({ message: 'No active login record found' });
        }

        const attendanceId = selectResults[0].id;
        const loginTime = new Date(selectResults[0].login_time);
        const logoutDate = new Date(logoutTime);

        // Calculate worked hours
        const workedHours = (logoutDate - loginTime) / (1000 * 60 * 60); // Convert milliseconds to hours

        // Update the logout time and worked hours for the found record
        await req.pool.query(`
            UPDATE psa_attendance 
            SET logout_time = ?, worked_hours = ? 
            WHERE id = ?
        `, [logoutTime, workedHours.toFixed(2), attendanceId]);

        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Error handling logout:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


module.exports = {
    handleLogin,
    handleLogout
};
