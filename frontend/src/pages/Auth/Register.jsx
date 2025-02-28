import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import 'react-toastify/dist/ReactToastify.css';
import { motion, AnimatePresence } from 'framer-motion';

const Register = () => {
    const [step, setStep] = useState(1);
    const [userType, setUserType] = useState('');
    const { setUser } = useUser();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        userType: '',
        skills: [],
        courses: [],
        careerGoals: [],
        preferences: {
            location: [],
            preferredStipendRange: '',
            remotePreference: false
        }
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleArrayChange = (name, value) => {
        setFormData({ ...formData, [name]: value.split(',').map(item => item.trim()) });
    };

    const handleRoleSelection = (selectedRole) => {
        const formattedRole = selectedRole === 'student' ? 'Student' : 'Teacher';
        setUserType(formattedRole);
        setFormData({ ...formData, userType: formattedRole });
        setStep(2);
    };

    const handleNext = () => setStep(step + 1);
    const handlePrev = () => setStep(step - 1);

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post('http://localhost:8000/api/auth/register', formData);
            const { user, token } = response.data;

            toast.success(response.data.message || 'Registration successful!');

            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('token', token);
            setUser(user);

            setTimeout(() => navigate('/home'), 2000);
        } catch (error) {
            toast.error('Registration failed. ' + (error.response?.data?.message || error.message));
        } finally {
            setIsLoading(false);
        }
    };

    const progressBarWidth = (step / 3) * 100;

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.5 } }
    };

    const formVariants = {
        initial: { x: 100, opacity: 0 },
        animate: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 100, damping: 15 } },
        exit: { x: -100, opacity: 0, transition: { duration: 0.3 } }
    };

    const buttonVariants = {
        hover: { scale: 1.05, boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)" },
        tap: { scale: 0.95 }
    };

    const roleCardVariants = {
        initial: { y: 20, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        hover: { y: -5, boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)" }
    };

    return (
        <motion.div 
            className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
        >
            <ToastContainer position="top-right" autoClose={3000} />
            
            <motion.div 
                className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="relative h-3 w-full bg-gray-200 rounded-full overflow-hidden mb-8">
                    <motion.div 
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                        initial={{ width: 0 }}
                        animate={{ width: `${progressBarWidth}%` }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                    />
                </div>

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div 
                            key="step1"
                            className="space-y-6 text-center"
                            variants={formVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                        >
                            <h2 className="text-4xl font-bold text-gray-800 mb-8">Welcome to our Learning Platform</h2>
                            <p className="text-lg text-gray-600 mb-8">Select your role to get started</p>
                            
                            <div className="flex flex-col md:flex-row justify-center gap-6">
                                <motion.div
                                    className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border-2 border-blue-200 cursor-pointer flex flex-col items-center"
                                    onClick={() => handleRoleSelection('student')}
                                    variants={roleCardVariants}
                                    initial="initial"
                                    animate="animate"
                                    whileHover="hover"
                                    transition={{ delay: 0.1 }}
                                >
                                    <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-bold text-blue-700">Student</h3>
                                    <p className="text-blue-600 mt-2">Join to learn and grow</p>
                                </motion.div>

                                <motion.div
                                    className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border-2 border-green-200 cursor-pointer flex flex-col items-center"
                                    onClick={() => handleRoleSelection('teacher')}
                                    variants={roleCardVariants}
                                    initial="initial"
                                    animate="animate"
                                    whileHover="hover"
                                    transition={{ delay: 0.2 }}
                                >
                                    <div className="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-bold text-green-700">Teacher</h3>
                                    <p className="text-green-600 mt-2">Share your knowledge</p>
                                </motion.div>
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div 
                            key="step2"
                            className="space-y-6"
                            variants={formVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                        >
                            <h2 className="text-3xl font-bold text-gray-800 mb-6">Create Your Account</h2>
                            <p className="text-gray-600 mb-6">Please provide your information to get started</p>
                            
                            <div className="space-y-4">
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        placeholder=" " 
                                        name="name" 
                                        value={formData.name} 
                                        onChange={handleChange} 
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors peer pt-6" 
                                        required
                                    />
                                    <label className="absolute left-4 top-4 text-gray-500 transition-all peer-focus:text-sm peer-focus:top-2 peer-focus:text-blue-500 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:-translate-y-2 pointer-events-none">Full Name</label>
                                </div>
                                
                                <div className="relative">
                                    <input 
                                        type="email" 
                                        placeholder=" " 
                                        name="email" 
                                        value={formData.email} 
                                        onChange={handleChange} 
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors peer pt-6" 
                                        required
                                    />
                                    <label className="absolute left-4 top-4 text-gray-500 transition-all peer-focus:text-sm peer-focus:top-2 peer-focus:text-blue-500 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:-translate-y-2 pointer-events-none">Email Address</label>
                                </div>
                                
                                <div className="relative">
                                    <input 
                                        type="password" 
                                        placeholder=" " 
                                        name="password" 
                                        value={formData.password} 
                                        onChange={handleChange} 
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors peer pt-6" 
                                        required
                                    />
                                    <label className="absolute left-4 top-4 text-gray-500 transition-all peer-focus:text-sm peer-focus:top-2 peer-focus:text-blue-500 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:-translate-y-2 pointer-events-none">Password</label>
                                </div>
                            </div>

                            <div className="flex justify-between pt-4">
                                <motion.button 
                                    onClick={handlePrev} 
                                    className="px-6 py-3 bg-gray-500 text-white rounded-lg flex items-center gap-2"
                                    variants={buttonVariants}
                                    whileHover="hover"
                                    whileTap="tap"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Back
                                </motion.button>
                                
                                <motion.button 
                                    onClick={handleNext} 
                                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg flex items-center gap-2"
                                    variants={buttonVariants}
                                    whileHover="hover"
                                    whileTap="tap"
                                >
                                    Next
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </motion.button>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && userType === 'Student' && (
                        <motion.div 
                            key="step3-student"
                            className="space-y-6"
                            variants={formVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                        >
                            <h2 className="text-3xl font-bold text-gray-800 mb-2">Tell Us About Yourself</h2>
                            <p className="text-gray-600 mb-6">This helps us personalize your learning experience</p>
                            
                            <div className="space-y-4">
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        placeholder=" " 
                                        onChange={(e) => handleArrayChange('skills', e.target.value)} 
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors peer pt-6" 
                                    />
                                    <label className="absolute left-4 top-4 text-gray-500 transition-all peer-focus:text-sm peer-focus:top-2 peer-focus:text-blue-500 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:-translate-y-2 pointer-events-none">Skills (comma separated)</label>
                                </div>
                                
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        placeholder=" " 
                                        onChange={(e) => handleArrayChange('courses', e.target.value)} 
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors peer pt-6" 
                                    />
                                    <label className="absolute left-4 top-4 text-gray-500 transition-all peer-focus:text-sm peer-focus:top-2 peer-focus:text-blue-500 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:-translate-y-2 pointer-events-none">Courses (comma separated)</label>
                                </div>
                                
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        placeholder=" " 
                                        onChange={(e) => handleArrayChange('careerGoals', e.target.value)} 
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors peer pt-6" 
                                    />
                                    <label className="absolute left-4 top-4 text-gray-500 transition-all peer-focus:text-sm peer-focus:top-2 peer-focus:text-blue-500 peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:-translate-y-2 pointer-events-none">Career Goals (comma separated)</label>
                                </div>
                            </div>

                            <div className="flex justify-between pt-4">
                                <motion.button 
                                    onClick={handlePrev} 
                                    className="px-6 py-3 bg-gray-500 text-white rounded-lg flex items-center gap-2"
                                    variants={buttonVariants}
                                    whileHover="hover"
                                    whileTap="tap"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Back
                                </motion.button>
                                
                                <motion.button 
                                    onClick={handleSubmit} 
                                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-lg flex items-center gap-2"
                                    variants={buttonVariants}
                                    whileHover="hover"
                                    whileTap="tap"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            Complete Registration
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </>
                                    )}
                                </motion.button>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && userType === 'Teacher' && (
                        <motion.div 
                            key="step3-teacher"
                            className="space-y-6"
                            variants={formVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                        >
                            <h2 className="text-3xl font-bold text-gray-800 mb-2">Complete Your Teacher Profile</h2>
                            <p className="text-gray-600 mb-6">Help students discover you and your expertise</p>
                            
                            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-yellow-700">
                                            Additional fields for teachers can go here if needed.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between pt-4">
                                <motion.button 
                                    onClick={handlePrev} 
                                    className="px-6 py-3 bg-gray-500 text-white rounded-lg flex items-center gap-2"
                                    variants={buttonVariants}
                                    whileHover="hover"
                                    whileTap="tap"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Back
                                </motion.button>
                                
                                <motion.button 
                                    onClick={handleSubmit} 
                                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-lg flex items-center gap-2"
                                    variants={buttonVariants}
                                    whileHover="hover"
                                    whileTap="tap"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            Complete Registration
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </>
                                    )}
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.div 
                    className="mt-8 text-center text-gray-500 text-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    Already have an account? <a href="/login" className="text-blue-600 hover:underline">Login here</a>
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

export default Register;