import React, { useState } from 'react';
import axios from 'axios';
import { PlusCircle, LoaderCircle, Sparkles } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';

const AddNewInterview = () => {
    const navigate = useNavigate();
    const { user } = useUser();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [jobPos, setJobPos] = useState('');
    const [jobDesc, setJobDesc] = useState('');
    const [jobExp, setJobExp] = useState('');
    const [loading, setLoading] = useState(false);
    const NODE_API = import.meta.env.VITE_NODE_API;
    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post(`${NODE_API}/interview/generate-interview`, {
                jobPos, 
                jobDesc, 
                jobExp, 
                userId: user?._id,  
            });

            console.log('Interview generated:', response.data);
            const interviewId = response.data.interview._id;
            navigate(`/interview/${interviewId}`);
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error generating interview:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ml-64 p-8 bg-gray-50">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-8 flex items-center">
                    <Sparkles className="mr-4 text-indigo-600" />
                    Create Your AI Interview Companion
                </h2>

                <div 
                    className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 overflow-hidden cursor-pointer"
                    onClick={() => setIsModalOpen(true)}
                >
                    <div 
                        className="p-8 bg-gradient-to-r from-indigo-50 to-blue-50 
                                   flex flex-col items-center justify-center 
                                   hover:from-indigo-100 hover:to-blue-100 transition-all group"
                    >
                        <PlusCircle 
                            className="w-16 h-16 text-indigo-600 mb-4 
                                       group-hover:scale-110 transition-transform"
                        />
                        <p className="text-xl font-semibold text-gray-800 text-center">
                            Start a New AI-Powered Interview
                        </p>
                    </div>
                </div>

                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm cursor-pointer" 
                         onClick={(e) => {
                             if (e.target === e.currentTarget) setIsModalOpen(false);
                         }}
                    >
                        <div 
                            className="bg-white w-[600px] rounded-3xl shadow-2xl border-2 border-indigo-100 
                                        animate-fade-in-up transform transition-all duration-300 
                                        hover:shadow-3xl overflow-hidden cursor-default"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="bg-gradient-to-r from-indigo-500 to-blue-600 p-6">
                                <h3 className="text-2xl font-bold text-white flex items-center">
                                    <Sparkles className="mr-3" />
                                    Interview Preparation Wizard
                                </h3>
                            </div>
                            
                            <form onSubmit={onSubmit} className="p-8 space-y-6">
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        Job Position
                                    </label>
                                    <input 
                                        type="text"
                                        placeholder="e.g., Senior Software Engineer"
                                        required
                                        className="w-full p-4 border-2 border-gray-200 rounded-xl 
                                                   focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 
                                                   transition-all duration-300 
                                                   hover:border-indigo-300"
                                        value={jobPos}
                                        onChange={(e) => setJobPos(e.target.value)}
                                    />
                                </div>
                                
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        Job Description & Tech Stack
                                    </label>
                                    <textarea 
                                        placeholder="e.g., React, Node.js, AWS, GraphQL"
                                        required
                                        rows={4}
                                        className="w-full p-4 border-2 border-gray-200 rounded-xl 
                                                   focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 
                                                   transition-all duration-300 
                                                   hover:border-indigo-300 resize-none"
                                        value={jobDesc}
                                        onChange={(e) => setJobDesc(e.target.value)}
                                    />
                                </div>
                                
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        Years of Experience
                                    </label>
                                    <input 
                                        type="number"
                                        placeholder="Years of professional experience"
                                        max="50"
                                        required
                                        className="w-full p-4 border-2 border-gray-200 rounded-xl 
                                                   focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 
                                                   transition-all duration-300 
                                                   hover:border-indigo-300"
                                        value={jobExp}
                                        onChange={(e) => setJobExp(e.target.value)}
                                    />
                                </div>
                                
                                <div className="flex justify-end space-x-4 pt-4">
                                    <button 
                                        type="button" 
                                        className="px-6 py-3 text-gray-600 hover:bg-gray-100 
                                                   rounded-xl transition-colors cursor-pointer"
                                        onClick={() => setIsModalOpen(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        className="px-7 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 
                                                   text-white rounded-xl hover:from-indigo-700 hover:to-blue-700 
                                                   transition-all duration-300 
                                                   disabled:opacity-50 disabled:cursor-not-allowed 
                                                   flex items-center shadow-md hover:shadow-lg cursor-pointer"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <LoaderCircle className="animate-spin mr-2" />
                                                Generating...
                                            </>
                                        ) : (
                                            'Start Interview'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddNewInterview;