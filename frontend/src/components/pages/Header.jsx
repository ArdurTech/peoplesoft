import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import '../styles/Header.css'; // CSS for styling the header

const Header = () => {
  const [showHeader, setShowHeader] = useState(false);
  const [employeeId, setEmployeeId] = useState(""); // State for Employee ID
  const history = useHistory(); // To handle navigation

  // Slide down effect on page load
  useEffect(() => {
    const storedEmployeeId = localStorage.getItem('employeeId'); // Retrieve employeeId from localStorage
    if (storedEmployeeId) {
      setEmployeeId(storedEmployeeId); // Set the employee ID state
    }
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setShowHeader(true);
    }, 100); // Delay to ensure smooth animation
  }, []);

  const handleGoBack = () => {
    history.goBack(); // Go back to the previous page
  };

  const handleLogout = () => {
    // Implement logout functionality here
    console.log('Logging out...');
    // You might want to clear the employee ID from localStorage and redirect
    localStorage.removeItem('employeeId');
    // Redirect to login or home page
    history.push('/login-page'); // Update with your desired path
  };

  return (
    <header className={`head1_header ${showHeader ? 'head1_header-visible' : ''}`}>
      <div className="head1_go-back-container">
        <button className="head1_go-back" onClick={handleGoBack}>Go Back</button>
      </div>
      <div className="head1_welcome">
        WELCOME TO ARDUR TECHNOLOGY
      </div>
      <div className="head1_employee-logout">
        {/* <span className="head1_employee-id">{`Login ID: ${employeeId}`}</span> */}
        {/* <button className="head1_logout" onClick={handleLogout}>Logout</button> */}
      </div>
    </header>
  );
};

export default Header;
