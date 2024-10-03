// src/EmployeeContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

// Create a Context
const EmployeeContext = createContext();

// Create a Provider component
export const EmployeeProvider = ({ children }) => {
  const [employeeId, setEmployeeId] = useState(null);

  useEffect(() => {
    // Retrieve employeeId from localStorage on initial load
    const storedEmployeeId = localStorage.getItem('employeeId');
    if (storedEmployeeId) {
      setEmployeeId(storedEmployeeId);
    }
  }, []);

  return (
    <EmployeeContext.Provider value={{ employeeId, setEmployeeId }}>
      {children}
    </EmployeeContext.Provider>
  );
};

// Create a custom hook to use the EmployeeContext
export const useEmployee = () => {
  return useContext(EmployeeContext);
};
