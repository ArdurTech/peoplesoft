import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import styles from "../styles/Signup.module.css";
import { Link, useHistory } from "react-router-dom";

function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const history = useHistory();

  useEffect(() => {
    document.title = "Login System - SignUp Page";
  }, []);

  const handleSignup = async (e) => {
    e.preventDefault(); // Disables the reload on submission
  
    try {
      // Validate input fields
      if (!username || !email || !password || !confirmPassword) {
        toast.warning("All fields are required.");
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast.error("Please enter a valid email address.");
        return;
      }
  
      // Check if passwords match
      if (password !== confirmPassword) {
        toast.warning("Passwords do not match.");
        return;
      }

      // Password criteria validation
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/; // At least 1 uppercase, 1 number, 8 characters
      if (!passwordRegex.test(password)) {
        toast.error("Password must be at least 8 characters long, contain at least one uppercase letter, and one number.");
        return;
      }
  
      // Send the signup request to the backend
      const res = await axios.post("http://psback.us-east-1.elasticbeanstalk.com/auth/signup", {
        username,
        email,
        password,
      });
  
      // Check if the response status indicates success
      if (res.status === 201) {
        // Store the employee ID in local storage
        localStorage.setItem("employeeId", res.data.employeeId); // Make sure employeeId is in response
  
        // Clear the form fields
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
  
        // Show success message and redirect
        toast.success("Registration successful! Redirecting...");
        setTimeout(() => {
          history.push("/employee-details");
        }, 3000);
      }
      
    } catch (error) {
      // Handle errors
      if (error.response && error.response.status === 400) {
        // Display the error message received from the backend
        toast.error(error.response.data);
      } else {
        console.error("Error Creating User: ", error);
        toast.error("Error Creating User");
      }
    }
  };
  
  return (
    <>
      <div className={"card"} id={styles.card}>
        <div className={"card-body"}>
          <h2 id={styles.h2}>SignUp</h2>
          <hr />
          <form onSubmit={handleSignup}>
            <div>
              <label>Username: </label>
              <input
                type="text"
                name="username"
                placeholder="Enter Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <label>Email: </label>
              <input
                type="email"
                name="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label>Password: </label>
              <input
                type="password"
                name="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <label>Confirm Password: </label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <div>
              <Link to="/login-page">Have an account? Log In</Link>
            </div>

            <button className={"btn btn-success"} type="submit">
              SignUp
            </button>
          </form>
        </div>
      </div>
    
      <footer className="footer">
        <div className="footer-content">
          <span>Contact us: 98765432112</span>
          <span>Email Address: info@ardurtechnology.com</span>
          <span>Address: Shivane, Shivkamal Prestige, Pune-411023</span>
        </div>
      </footer>
    </>
  );
}

export default SignupPage;
