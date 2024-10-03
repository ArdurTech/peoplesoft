import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Link, useHistory } from "react-router-dom";
import { FaMapMarkerAlt } from "react-icons/fa"; // Ensure you import this
import styles from "../styles/Login.module.css";
import { useEmployee } from './EmployeeContext'; 

function Footer() {
  const handleLocationClick = () => {
    window.open(
      'https://www.google.com/maps/place/?q=Ardur+Technology,+4th+Floor,+NDA,+Shivkamal+prestige,+Road,+Samarth+Puram,+Dangat+Patil+Nagar,+Shivane,+Pune,+Maharashtra+411023',
      '_blank'
    );
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        <span>Contact us: 070280 92713</span>
        <span>Email Address: info@ardurtechnology.com</span>
        <span onClick={handleLocationClick} className="location-link">
          <FaMapMarkerAlt /> Ardur Technology
        </span>
      </div>
    </footer>
  );
}

function LoginPage() {
  const [password, setPassword] = useState("");
  const [employeeId, setEmployeeId] = useState(""); // Local state for Employee ID
  const history = useHistory();
  const { setEmployeeId: setEmployeeIdContext } = useEmployee(); // Use context to set employeeId if necessary

  useEffect(() => {
    document.title = "Login System - LogIn Page";
    
    // Retrieve employeeId from localStorage on component mount
    const storedEmployeeId = localStorage.getItem('employeeId');
    if (storedEmployeeId) {
      setEmployeeId(storedEmployeeId); // Set the employeeId state from localStorage
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      // Validate input fields
      if (!password || !employeeId) {
        toast.warning("Employee ID and Password are required");
        return;
      }
  
      // Make login request
      const res = await axios.post("http://psback.us-east-1.elasticbeanstalk.com/auth/login", {
        employeeId,
        password,
      });
  
      if (res.status === 200) {
        // Clear password field
        setPassword("");
  
        // Store employeeId and token in localStorage
        localStorage.setItem('employeeId', employeeId);
        const token = res.data.token;
        localStorage.setItem("token", token);
  
        // Set employeeId in context or state if needed
        setEmployeeIdContext(employeeId);
  
        toast.success("LogIn Successful, Redirecting...");
  
        // Redirect to Special page
        history.push("/special-page");
      }
    } catch (error) {
      if (error.response) {
        // Specific handling for different errors
        switch (error.response.status) {
          case 401:
            toast.error("Incorrect password");
            break;
          case 403:
            toast.warning("Please fill out your employee details before logging in.");
            console.log("Redirecting to /employee-details");
            history.push("/employee-details");
            break;
          case 404:
            toast.warning("User with this Employee ID doesn't exist");
            break;
          case 400:
            toast.error(error.response.data || "Bad Request");
            break;
          default:
            toast.error("Error Logging User: " + (error.response.data || "Unexpected error"));
        }
      } else {
        console.error("Error Logging User: ", error);
        toast.error("Network Error: Unable to connect to the server.");
      }
    }
  };

  
  return (
    <>
      <div className={"card"} id={styles.card}>
        <div className={"card-body"}>
          <h2 id={styles.h2}>LogIn</h2>
          <hr />
          <form onSubmit={handleLogin}>
            {/* For Employee ID */}
            <div>
              <label>Login ID: </label>
              <input
                type="text"
                name="employeeId"
                placeholder={"Enter Employee ID"}
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
              />
            </div>

            {/* For Password */}
            <div>
              <label>Password: </label>
              <input
                type="password"
                name="password"
                placeholder={"Enter Password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <Link to="/signup">Don&apos;t have an account? SignUp</Link>
            </div>

            <div>
              <Link to="/password-forgot">Forgot Password?</Link>
            </div>

            {/* Login Button */}
            <button
              className={"btn btn-success"}
              id={styles.button}
              type="submit"
            >
              LogIn
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default LoginPage;
