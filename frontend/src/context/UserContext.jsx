import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const UserContext = createContext();
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const NODE_API = import.meta.env.VITE_NODE_API;

    const fetchUser = async (userId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${NODE_API}/auth/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            // Handle different possible response structures
            let userData;
            if (response.data.user) {
                // If response has a nested user object
                userData = response.data.user;
            } else {
                // If response data is the user object directly
                userData = response.data;
            }
            
            // Ensure the user object has an _id field
            if (!userData._id && userData.id) {
                userData._id = userData.id;
            }
            
            // Set user with token
            setUser({ ...userData, token });
        } catch (error) {
            console.error('❌ Failed to fetch user', error);
            setUser(null);
            localStorage.removeItem('token');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            try {
                const decoded = jwtDecode(token);
                // Handle different possible ID field names in JWT
                const userId = decoded.id || decoded._id || decoded.userId;
                
                if (userId) {
                    fetchUser(userId);
                } else {
                    console.error('❌ No user ID found in token');
                    setUser(null);
                    localStorage.removeItem('token');
                    setLoading(false);
                }
            } catch (error) {
                console.error('❌ Invalid token', error);
                setUser(null);
                localStorage.removeItem('token');
                setLoading(false);
            }
        } else {
            setUser(null);
            setLoading(false);
        }
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, loading }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;