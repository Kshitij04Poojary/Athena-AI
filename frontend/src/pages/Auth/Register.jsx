import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

const Register = () => {
    const [step, setStep] = useState(1);
    const [role, setRole] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: '',
        skills: [],
        courses: [],
        careerGoals: []
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleArrayChange = (name, value) => {
        setFormData({ ...formData, [name]: value.split(',').map(item => item.trim()) });
    };

    const handleRoleSelection = (selectedRole) => {
        setRole(selectedRole);
        setFormData({ ...formData, role: selectedRole });
        setStep(2);
    };

    const handleNext = () => setStep(step + 1);
    const handlePrev = () => setStep(step - 1);

    const handleSubmit = async () => {
        console.log("Submitting Form Data:", formData);  // Log what you are sending
    
        try {
            const response = await axios.post('http://localhost:8000/api/auth/register', formData);
            alert(response.data.message);
        } catch (error) {
            alert('Registration failed. ' + (error.response?.data?.message || error.message));
        }
    };
    

    const progressBarWidth = (step / 3) * 100;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
            <ToastContainer />
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-3xl space-y-6">
                {/* Progress Bar */}
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${progressBarWidth}%` }} />
                </div>

                {/* Step 1 - Role Selection */}
                {step === 1 && (
                    <div className="space-y-4 text-center">
                        <h2 className="text-3xl font-bold text-gray-800">Select Your Role</h2>
                        <div className="flex justify-center space-x-6">
                            <button onClick={() => handleRoleSelection('student')} className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-40">Student</button>
                            <button onClick={() => handleRoleSelection('teacher')} className="p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 w-40">Teacher</button>
                        </div>
                    </div>
                )}

                {/* Step 2 - Basic Info */}
                {step === 2 && (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold">Basic Information</h2>
                        <input type="text" placeholder="Name" name="name" value={formData.name} onChange={handleChange} className="w-full p-3 border rounded-lg" />
                        <input type="email" placeholder="Email" name="email" value={formData.email} onChange={handleChange} className="w-full p-3 border rounded-lg" />
                        <input type="password" placeholder="Password" name="password" value={formData.password} onChange={handleChange} className="w-full p-3 border rounded-lg" />

                        <div className="flex justify-between">
                            <button onClick={handlePrev} className="p-3 bg-gray-500 text-white rounded-lg">Back</button>
                            <button onClick={handleNext} className="p-3 bg-blue-600 text-white rounded-lg">Next</button>
                        </div>
                    </div>
                )}

                {/* Step 3 - Skills & Goals (For Students) */}
                {step === 3 && role === 'student' && (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold">Skills & Goals</h2>
                        <input type="text" placeholder="Skills (comma separated)" onChange={(e) => handleArrayChange('skills', e.target.value)} className="w-full p-3 border rounded-lg" />
                        <input type="text" placeholder="Courses (comma separated)" onChange={(e) => handleArrayChange('courses', e.target.value)} className="w-full p-3 border rounded-lg" />
                        <input type="text" placeholder="Career Goals (comma separated)" onChange={(e) => handleArrayChange('careerGoals', e.target.value)} className="w-full p-3 border rounded-lg" />

                        <div className="flex justify-between">
                            <button onClick={handlePrev} className="p-3 bg-gray-500 text-white rounded-lg">Back</button>
                            <button onClick={handleSubmit} className="p-3 bg-green-600 text-white rounded-lg">Submit</button>
                        </div>
                    </div>
                )}

                {/* Step 3 for Teachers (Simple Form) */}
                {step === 3 && role === 'teacher' && (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold">Teacher Information</h2>
                        <p className="text-gray-600">Additional teacher fields can be added later.</p>

                        <div className="flex justify-between">
                            <button onClick={handlePrev} className="p-3 bg-gray-500 text-white rounded-lg">Back</button>
                            <button onClick={handleSubmit} className="p-3 bg-green-600 text-white rounded-lg">Submit</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Register;
