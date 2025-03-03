import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";

const ExamDashboard = () => {
    const navigate = useNavigate(); 
    const { user } = useUser();
    const [topic, setTopic] = useState("");
    const [loading, setLoading] = useState(false);  // Added loading state
      // useEffect(() => {
    //     console.log(user?.id)
    // }
    // , [user]);
    const generateAssessment = async () => {
        if (!topic.trim()) {
            alert("Please enter a topic.");
            return;
        }
        
        setLoading(true);  // Start loading

        try {           
            const res = await axios.post("http://localhost:8000/api/assessment/generate", {
                 // userId: user?.id,
                userId: "67c5c4b6ee979a1d4e8db9f7",
                topic
            });
            console.log("Generated assessment:", res.data);
            const examId = res.data._id;
            navigate(`/assessment/${examId}`);
        } catch (error) {
            console.error("Error generating assessment", error);
        } finally {
            setLoading(false);  // Stop loading after response
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg">
                <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">Exam Dashboard</h2>
                <p className="text-gray-600 text-center mb-6">Enter a topic to generate an assessment</p>

                <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Enter a topic..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={loading} // Disable input when loading
                />

                <button
                    onClick={generateAssessment}
                    className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md flex items-center justify-center"
                    disabled={loading}  // Disable button while loading
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l4-4-4-4v4a8 8 0 00-8 8h4z"></path>
                            </svg>
                            Generating from AI...
                        </>
                    ) : "Generate Assessment"}
                </button>
            </div>
        </div>
    );
};

export default ExamDashboard;
