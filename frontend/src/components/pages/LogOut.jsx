import React from 'react';
import { useHistory } from 'react-router-dom';
import '../styles/LogOut.css'; // Import the CSS file for styling

const LogOut = () => {
  const history = useHistory();

  const handleLogout = () => {
    // Clear the token or any other logout logic if needed
    localStorage.removeItem('token');
    // Redirect to the login page
    history.push('/login-page');
  };

  return (
    <div className="logout-container">
      <h1 className="logout-heading">LogOut</h1> {/* Added a LogOut heading */}
      <div className='log'>
        <h3>If you want to logout, click on the following button:</h3>
        <button className="logout-button" onClick={handleLogout}>
          LogOut
        </button>
      </div>
    </div>
  );
};

export default LogOut;
