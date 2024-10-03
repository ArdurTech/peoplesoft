const jwt = require("jsonwebtoken");

// Token function that will be sending the token with some information in it
const token = (foundUser, response) => {
  // Create a JWT with the user's id, username, email, and employee details
  const jwtToken = jwt.sign(
    {
      id: foundUser.id,
      username: foundUser.username,
      email: foundUser.email,
      employeeId: foundUser.employee_id, // Include Employee ID in the token payload
      // Optionally include more employee details if needed
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d"
    }
  );

  // Set the token as a cookie in the response headers
  response.cookie("token", jwtToken, {
    httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
    maxAge: 30 * 24 * 60 * 60 * 1000, // Cookie expires in 30 days
    secure: process.env.NODE_ENV === 'production', // Use 'secure' only in production
    sameSite: 'Strict' // Prevents CSRF attacks by ensuring the cookie is only sent with requests from your site
  });

  // Sending the generated cookie back to the client with a success message
  return response.status(200).json({
    msg: "Token generated successfully",
    username: foundUser.username,
    employeeId: foundUser.employee_id // Optionally include Employee ID in the response
  });
};

// Exporting the created token function
module.exports = token;
