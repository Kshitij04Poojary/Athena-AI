import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); // Added loading state for better handling

    const fetchUser = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.log('No token found, skipping user fetch');
            setUser(null);
            setLoading(false);
            return;
        }

        try {
            const response = await axios.get('http://localhost:8000/api/auth/profile', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUser(response.data.user);
        } catch (error) {
            console.error('Failed to fetch user', error);
            setUser(null); // Clear user if token is invalid
            localStorage.removeItem('token'); // Remove token if it causes error (invalid/expired)
        } finally {
            setLoading(false); // Ensure loading is set to false even if request fails
        }
    };

    useEffect(() => {
        fetchUser(); // Run on initial load/refresh
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, loading }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;
