const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

// Send OTP to the user's email
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const otp = crypto.randomInt(100000, 999999); // Generate a 6-digit OTP

  try {
    // Check if the email exists in the database
    const [user] = await req.pool.query('SELECT * FROM psa_users WHERE email = ?', [email]);
    if (user.length === 0) {
      return res.status(404).json({ success: false, message: 'Email not found.' });
    }

    // Save OTP and expiry to the database
    await req.pool.query('UPDATE psa_users SET otp = ?, otp_expiry = DATE_ADD(NOW(), INTERVAL 15 MINUTE) WHERE email = ?', [otp, email]);

    // Send OTP email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      to: email,
      subject: 'Password Reset OTP',
      text: `Your OTP is ${otp}. It will expire in 15 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: 'OTP sent to your email.' });
  } catch (error) {
    console.error('Error in forgotPassword:', error.message);
    console.error('Stack Trace:', error.stack);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// Verify OTP and update password
const verifyOtp = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    // Check OTP validity
    const [user] = await req.pool.query('SELECT * FROM psa_users WHERE email = ? AND otp = ? AND otp_expiry > NOW()', [email, otp]);
    if (user.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP.' });
    }

    // Hash the new password before storing it in the database
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the password and reset OTP fields
    await req.pool.query('UPDATE psa_users SET password = ?, otp = NULL, otp_expiry = NULL WHERE email = ?', [hashedPassword, email]);

    res.json({ success: true, message: 'Password updated successfully.' });
  } catch (error) {
    console.error('Error in verifyOtp:', error.message);
    console.error('Stack Trace:', error.stack);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = {
  forgotPassword,
  verifyOtp,
};
