import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom'; // Correctly import useHistory
import { toast } from 'react-toastify';
import axios from 'axios';
import '../styles/DailyAttendance.css';
import { useAuth } from './AuthContext';

const DailyAttendance = () => {
    const { employeeId, setEmployeeId, login, logout } = useAuth();
    const history = useHistory(); // Initialize history using useHistory
    const [workMode, setWorkMode] = useState('');
    const [loginTime, setLoginTime] = useState(null);
    const [logoutTime, setLogoutTime] = useState(null);
    const [workedHours, setWorkedHours] = useState(0);
    const [startTime, setStartTime] = useState(null);
    const [timer, setTimer] = useState(0);
    const [ipAddress, setIpAddress] = useState('');
    const [comment, setComment] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Fetch the employeeId from localStorage when the component mounts
    useEffect(() => {
        const storedEmployeeId = localStorage.getItem('employeeId');
        if (storedEmployeeId) {
            setEmployeeId(storedEmployeeId);
        }
    }, [setEmployeeId]);

    // Format date to MySQL DATETIME format
    const formatDate = (date) => {
        const d = new Date(date);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
    };

    // Fetch the IP Address
    useEffect(() => {
        const fetchIpAddress = async () => {
            try {
                const response = await axios.get('https://api.ipify.org?format=json');
                setIpAddress(response.data.ip);
            } catch (error) {
                console.error('Error fetching IP address:', error);
            }
        };
        fetchIpAddress();
    }, []);

    // Load login details from localStorage on page load
    useEffect(() => {
        const storedLoginTime = localStorage.getItem('loginTime');
        const storedWorkMode = localStorage.getItem('workMode');

        if (employeeId && storedLoginTime) {
            setLoginTime(storedLoginTime);
            setWorkMode(storedWorkMode || '');
            setStartTime(new Date(storedLoginTime));
        }
    }, [employeeId]);

    // Timer for worked hours
    useEffect(() => {
        let interval = null;
        if (startTime) {
            interval = setInterval(() => {
                setTimer((prev) => prev + 1);
                setWorkedHours(((timer + 1) / 3600).toFixed(2));
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [startTime, timer]);

    const handleLogin = () => {
        if (!employeeId) {
            setErrorMessage('Employee ID is required');
            return;
        }

        if ((workMode === 'Work from Home' || workMode === 'Work from Client Location') && !comment) {
            setErrorMessage('Comment is required for this work mode');
            return;
        }

        setErrorMessage(''); // Clear error message if validation passes

        const currentTime = formatDate(new Date());
        setLoginTime(currentTime);

        // Save login details and employeeId to localStorage
        localStorage.setItem('loginTime', currentTime);
        localStorage.setItem('workMode', workMode);
        localStorage.setItem('employeeId', employeeId); // Store employeeId to localStorage

        axios.post('http://psback.us-east-1.elasticbeanstalk.com/api/attendance', {
            employeeId,
            workMode,
            loginTime: currentTime,
            ipAddress
        })
        .then(response => {
            if (response.data.success) {
                console.log(response.data.message);
                setStartTime(new Date());
                setComment('');
                setWorkMode('');
            } else {
                console.error(response.data.message);
            }
        })
        .catch(error => {
            console.error('Error logging in:', error);
        });
    };

    const handleLogout = () => {
        const currentTime = formatDate(new Date());
        setLogoutTime(currentTime);
    
        axios.post('http://psback.us-east-1.elasticbeanstalk.com/api/attendance/logout', {
            employeeId,
            logoutTime: currentTime
        })
        .then(response => {
            console.log(response.data);
    
            // Clear login state and localStorage
            setLoginTime(null);
            setStartTime(null);
            setWorkedHours(0);
            setComment('');
            setWorkMode('');
            logout(); // Use logout function from AuthContext
            localStorage.removeItem('loginTime');
            localStorage.removeItem('workMode');
            localStorage.removeItem('employeeId'); // Optionally clear employeeId
    
            // Show a success notification
            toast.success('Successfully logged out! Redirecting to login page...');
    
            // Redirect to login page after a short delay
            setTimeout(() => {
                history.push('/login-page'); // Use history.push for redirection
            }, 3000); // 3 seconds delay for the user to see the notification
        })
        .catch(error => {
            console.error('Error logging out:', error);
            toast.error('Logout failed! Please try again.'); // Show an error notification
        });
    };
    return (
        <div className="attendance-container">
            <div className="attendance-content">
                <h1 className="attendance-heading">Daily Attendance</h1>
                <img
                    src="https://www.soest.hawaii.edu/UHMC/images/toggles/employees.png"
                    alt="Employee"
                    className="employee-image"
                />
                <div className="attendance-form">
                    {loginTime ? (
                        <div className="time-display">
                            <p>Login Time: {new Date(loginTime).toLocaleString()}</p>
                            <p>Worked Hours: {workedHours} hours</p>
                            <button onClick={handleLogout} className="logout-button">Logout</button>
                        </div>
                    ) : (
                        <>
                            <label>Work Mode:</label>
                            <select
                                className="work-mode-select"
                                value={workMode}
                                onChange={(e) => setWorkMode(e.target.value)}
                            >
                                <option value="">Select Work Mode</option>
                                <option value="Work from Home">Work from Home</option>
                                <option value="Work from Office">Work from Office</option>
                                <option value="Work from Client Location">Work from Client Location</option>
                            </select>

                            {workMode && (
                                <>
                                    <div>
                                        <label>Employee ID:</label>
                                        <input
                                            className="login-input"
                                            type="text"
                                            value={employeeId || ''} // Auto-populate employeeId from context
                                            onChange={(e) => setEmployeeId(e.target.value)} // Update employeeId in context and localStorage
                                            placeholder="Enter Employee ID"
                                        />
                                    </div>

                                    {(workMode === 'Work from Home' || workMode === 'Work from Client Location') && (
                                        <div>
                                            <label>Comment:</label>
                                            <input
                                                className="comment-input"
                                                type="text"
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                                placeholder="Enter comment"
                                            />
                                        </div>
                                    )}
                                </>
                            )}

                            {errorMessage && <p className="error-message">{errorMessage}</p>}

                            <div className="attendance-buttons">
                                <button onClick={handleLogin} className="login-button">Login</button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DailyAttendance;
