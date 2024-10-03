const nodemailer = require('nodemailer');

// Create a reusable transporter object using Gmail as the email service
const transporter = nodemailer.createTransport({
  service: 'Gmail', // Change this to your email service provider if needed
  auth: {
    user: process.env.EMAIL_USER, // Your email address (e.g., your-email@gmail.com)
    pass: process.env.EMAIL_PASS // Your email password or app password
  }
});

// Function to send a basic email
const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender address
    to, // List of recipients
    subject, // Subject line
    text // Plain text body
  };

  try {
    // Send mail with defined transport object
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error);
    throw new Error('Failed to send email');
  }
};

// Function to send employee details email
const sendEmployeeDetailsEmail = async (to, employeeId, fullName, gender, aadhaarNo, panCardNo, localAddress, permanentAddress, age, education) => {
  const subject = 'Your Employee Details';
  const text = `Dear ${fullName},

Here are your employee details:

- Employee ID: ${employeeId}
- Full Name: ${fullName}
- Gender: ${gender}
- Aadhaar No: ${aadhaarNo}
- PAN Card No: ${panCardNo}
- Local Address: ${localAddress}
- Permanent Address: ${permanentAddress}
- Age: ${age}
- Education: ${education}

If you have any questions, please contact our HR department.

Best regards,
Your Company`;

  try {
    await sendEmail(to, subject, text);
  } catch (error) {
    console.error(`Failed to send employee details email to ${to}:`, error);
    throw new Error('Failed to send employee details email');
  }
};

module.exports = { sendEmail, sendEmployeeDetailsEmail };
