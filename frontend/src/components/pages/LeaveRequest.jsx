import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'sonner';
import { useHistory } from 'react-router-dom';
import '../styles/LeaveRequest.css';
import { useEmployee } from './EmployeeContext'; 
import Header1 from './Header1';

const LeaveRequest = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    employeeId: '',
    department: '',
    date: '', // This will be set to current date
    absenceType: '',
    reason: '',
    absenceFrom: '',
    absenceThrough: '',
    earlyLeaving: '', 
    lateComing: ''
  });

  const history = useHistory();

  // Automatically set employeeId from localStorage and set current date
  useEffect(() => {
    const storedEmployeeId = localStorage.getItem('employeeId');
    const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format

    if (storedEmployeeId) {
      setFormData((prevData) => ({
        ...prevData,
        employeeId: storedEmployeeId,
        date: currentDate, // Set the current date
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Check for date validation
    if (name === 'absenceThrough' && value < formData.absenceFrom) {
      toast.error('Please select a valid date ');
      return;
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    toast.dismiss();

    console.log('Submitting form with data:', formData);

    try {
      const response = await axios.post('http://psback.us-east-1.elasticbeanstalk.com/api/leave-requests', formData);
      console.log('Leave request submitted:', response.data);
      toast.success('Leave request submitted successfully!');

      setTimeout(() => {
        window.location.reload();
      }, 3000);

      history.push("/special-page");
    } catch (error) {
      console.error('Error submitting leave request:', error.response?.data || error.message);
      toast.error('Error submitting leave request. Please try again.');
    }
  };

  return (
    <div className="leave-request-container">
      <header className="leave-request-header">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJrfOVb7CkbNIqKC0GU6AYyl-bzSctGwsYEw&s" alt="Company Logo" className="company-logo" />
        <h1 className="header-title">Leave Request</h1>
      </header>

      <form className="leave-request-form" onSubmit={handleSubmit}>
        <div className="row">
          <div className="input-field">
            <label>First Name</label>
            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
          </div>
          <div className="input-field">
            <label>Last Name</label>
            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
          </div>
        </div>

        <div className="row">
          <div className="input-field">
            <label>Login ID</label>
            <input type="text" name="employeeId" value={formData.employeeId} disabled />
          </div>
          <div className="input-field">
            <label>Department</label>
            <select name="department" value={formData.department} onChange={handleChange}>
              <option value="">Select Department</option>
              <option value="HR">HR</option>
              <option value="IT">IT</option>
              <option value="Sales">Sales</option>
              <option value="Marketing">Marketing</option>
              <option value="Operations">Operations</option>
            </select>
          </div>
          <div className="input-field">
            <label>Date</label>
            <input type="date" name="date" value={formData.date} readOnly /> {/* Make the date input read-only */}
          </div>
        </div>

        <label className='absence'>Leave Type</label>
        <div className="radio-container">
          <div className="radio-column">
            <div className="radio-group">
              <label>
                <input type="radio" name="absenceType" value="Sick" checked={formData.absenceType === 'Sick'} onChange={handleChange} />
                Sick
              </label>
              <label>
                <input type="radio" name="absenceType" value="Maternity/Paternity" checked={formData.absenceType === 'Maternity/Paternity'} onChange={handleChange} />
                Maternity/Paternity
              </label>
              <label>
                <input type="radio" name="absenceType" value="Personal Leave" checked={formData.absenceType === 'Personal Leave'} onChange={handleChange} />
                Personal Leave
              </label>
            </div>
          </div>

          <div className="radio-column">
            <div className="radio-group">
              <label>
                <input type="radio" name="absenceType" value="Time off without payment" checked={formData.absenceType === 'Time off without payment'} onChange={handleChange} />
                Time off without payment
              </label>
              <label>
                <input type="radio" name="absenceType" value="Bereavement" checked={formData.absenceType === 'Bereavement'} onChange={handleChange} />
                Bereavement
              </label>
              <label>
                <input type="radio" name="absenceType" value="Others" checked={formData.absenceType === 'Others'} onChange={handleChange} />
                Others
              </label>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="input-field">
            <label>Reason</label>
            <textarea name="reason" rows="3" value={formData.reason} onChange={handleChange}></textarea>
          </div>
        </div>

        <div className="row">
          <div className="input-field">
            <label>Leave From</label>
            <input type="date" name="absenceFrom" value={formData.absenceFrom} onChange={handleChange} />
          </div>
          <div className="input-field">
            <label>Leave To</label>
            <input type="date" name="absenceThrough" value={formData.absenceThrough} onChange={handleChange} />
          </div>
        </div>

        <div className="row">
          <div className="input-field">
            <label>Early Leaving Time</label>
            <input type="time" name="earlyLeaving" value={formData.earlyLeaving} onChange={handleChange} />
          </div>
          <div className="input-field">
            <label>Late Coming Time</label>
            <input type="time" name="lateComing" value={formData.lateComing} onChange={handleChange} />
          </div>
        </div>

        <div className="certification-note">
          <p>
            <strong>Certification:</strong> I hereby request leave for the above-mentioned reasons and certify that the
            information provided is true and accurate.
          </p>
        </div>

        <div className="submit-btn">
          <button type="submit">Submit</button>
        </div>
      </form>

      <footer className="leave-request-footer">Document Management Software by Ardur Technology</footer>
    </div>
  );
};

export default LeaveRequest;
