import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { useEmployee } from './EmployeeContext'; 
import "../styles/EmployeeDetails.css";

const EmployeeDetails = () => {
  const { employeeId } = useEmployee(); // Get employeeId from context

  const [formData, setFormData] = useState({
    employee_id: "",
    fullName: "",
    email: "",
    gender: "",
    aadhaar: "",
    pan: "",
    local_address: "",
    permanent_address: "",
    age: "",
    education: "",
    contact_no: "",
    emergency_contact: "",
    blood_group: "",
    birth_date: ""
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const history = useHistory();

  // Auto-populate employee_id from context (if available)
  useEffect(() => {
    if (employeeId) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        employee_id: employeeId,
      }));
    }
  }, [employeeId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    // Calculate age if the birth_date field is updated
    if (name === "birth_date") {
      newValue = value;
      const birthDate = new Date(value);
      const age = new Date().getFullYear() - birthDate.getFullYear();
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: newValue,
        age: age // Update age based on birthdate
      }));
    } else {
      setFormData({
        ...formData,
        [name]: name === 'age' ? Number(value) : value, // Convert age to a number
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await axios.post("http://psback.us-east-1.elasticbeanstalk.com/api/employee-details", formData);
      setSuccess("Employee details added successfully.");
      history.push("/login-page");
    } catch (err) {
      console.error("Error submitting employee details:", err);
      setError(err.response?.data.message || "An error occurred while submitting the form.");
    }
  };

  return (
    <div className="employee-details-container">
      <h4>Employee Details</h4>
      <form onSubmit={handleSubmit}>
        {/* Row 1: Login ID & Full Name */}
        <div className="form-row">
          <div className="form-group">
            <label>Login ID:</label>
            <input
              type="text"
              name="employee_id"
              value={formData.employee_id}
              onChange={handleChange}
              required
              // readOnly={!!formData.employee_id} // Make the field readonly if populated from context
            />
          </div>
          <div className="form-group">
            <label>Full Name:</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        {/* Row 2: Aadhaar No & PAN Card No */}
        <div className="form-row">
          <div className="form-group">
            <label>Aadhaar No:</label>
            <input
              type="text"
              name="aadhaar"
              value={formData.aadhaar}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>PAN Card No:</label>
            <input
              type="text"
              name="pan"
              value={formData.pan}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Row 3: Local Address & Permanent Address */}
        <div className="form-row">
          <div className="form-group">
            <label>Local Address:</label>
            <input
              type="text"
              name="local_address"
              value={formData.local_address}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Permanent Address:</label>
            <input
              type="text"
              name="permanent_address"
              value={formData.permanent_address}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Row 4: Contact No & Emergency Contact */}
        <div className="form-row">
          <div className="form-group">
            <label>Contact No:</label>
            <input
              type="text"
              name="contact_no"
              value={formData.contact_no}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Emergency Contact:</label>
            <input
              type="text"
              name="emergency_contact"
              value={formData.emergency_contact}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Row 5: Email & Education */}
        <div className="form-row">
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Education:</label>
            <input
              type="text"
              name="education"
              value={formData.education}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Row 6: Birth Date & Gender */}
        <div className="form-row">
          <div className="form-group">
            <label>Birth Date:</label>
            <input
              type="date"
              name="birth_date"
              value={formData.birth_date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Gender:</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Row 7: Blood Group & Age */}
        <div className="form-row">
        <div className="form-group">
  <label>Blood Group:</label>
  <select
    name="blood_group"
    value={formData.blood_group}
    onChange={handleChange}
    required
  >
    <option value="">Select Blood Group</option>
    <option value="A+">A+</option>
    <option value="A-">A-</option>
    <option value="B+">B+</option>
    <option value="B-">B-</option>
    <option value="O+">O+</option>
    <option value="O-">O-</option>
    <option value="AB+">AB+</option>
    <option value="AB-">AB-</option>
  </select>
</div>

          
          <div className="form-group">
            <label>Age:</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
              readOnly // Make age field read-only since it will be auto-calculated
            />
          </div>
        </div>

        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
    </div>
  );
};

export default EmployeeDetails;
