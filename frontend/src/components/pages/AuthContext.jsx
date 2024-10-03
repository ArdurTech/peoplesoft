import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [employeeId, setEmployeeId] = useState('');

    const login = () => {
        // Your login logic here
    };

    const logout = () => {
        // Your logout logic here
    };

    return (
        <AuthContext.Provider value={{ employeeId, setEmployeeId, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
