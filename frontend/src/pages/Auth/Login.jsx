import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async () => {
        try {
            const response = await axios.post('http://localhost:8000/api/auth/login', formData);
            toast.success('Login successful');
            localStorage.setItem('token', response.data.token);
        } catch (error) {
            toast.error('Login failed: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
            <ToastContainer />
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-bold mb-6">Login</h2>

                <input type="email" placeholder="Email" name="email" value={formData.email} onChange={handleChange} className="w-full p-3 border rounded-lg mb-4" />
                <input type="password" placeholder="Password" name="password" value={formData.password} onChange={handleChange} className="w-full p-3 border rounded-lg mb-4" />

                <button onClick={handleSubmit} className="w-full p-3 bg-blue-600 text-white rounded-lg">Login</button>
            </div>
        </div>
    );
};

export default Login;
