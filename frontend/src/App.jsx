import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Auth/Register';
import Login from './pages/Auth/Login';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
    return (
        <Router>
            <div className="min-h-screen bg-gray-50 flex justify-center items-center min-w-screen">
                <Routes>
                    <Route path="/" element={<Navigate to="/register" />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
