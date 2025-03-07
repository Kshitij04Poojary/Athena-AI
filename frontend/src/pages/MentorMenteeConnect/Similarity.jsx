import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '../../context/UserContext';

const Similarity = () => {
    const { user } = useUser();
    const [professors, setProfessors] = useState(null);
    const [loading, setLoading] = useState(false);
    const [assigning, setAssigning] = useState({}); // Tracks loading state for each professor

    console.log("Professors:", professors);

    async function fetchData() {
        try {
            setLoading(true);
            const response = await axios.post(
                "http://127.0.0.1:5004/mentor-mentee/", 
                { "user_id": user?._id },  
                { withCredentials: true }
            );          
            console.log("Fetched Professors:", response.data);
            setProfessors(response.data);
        } catch (error) {
            console.error("Error fetching data:", error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user]);

    // Assign a professor to the mentee
    const assignProfessor = async (professorId) => {
        console.log("User ID (Mentee):", user?._id);
        console.log("Professor ID (Mentor):", professorId);
    
        setAssigning((prev) => ({ ...prev, [professorId]: true }));
    
        try {
            const response = await axios.post(
                "http://localhost:8000/api/assign/assign-mentee",
                {
                    menteeId: user?._id, 
                    mentorId: professorId
                },
                { withCredentials: true }
            );
    
            console.log("Assignment successful:", response.data);
            alert("Professor assigned successfully!");
        } catch (error) {
            console.error("Error assigning professor:", error.response?.data || error.message);
            alert("Failed to assign professor.");
        } finally {
            setAssigning((prev) => ({ ...prev, [professorId]: false }));
        }
    };
    

    // Format score as percentage
    const formatScore = (score) => (score * 100).toFixed(2) + '%';

    return (
        <div className="w-full max-w-4xl mx-auto p-4 bg-gray-50 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Professor Directory</h2>

            {loading ? (
                <div className="flex justify-center py-6">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full bg-white border border-gray-200 rounded-md">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2 text-left">Name</th>
                                <th className="px-4 py-2 text-left">Email</th>
                                <th className="px-4 py-2 text-left">Match Score</th>
                                <th className="px-4 py-2 text-left">Skills</th>
                                <th className="px-4 py-2 text-left">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {professors && professors.map((professor) => (
                                <tr key={professor._id} className="border-t border-gray-200 hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium">{professor.name}</td>
                                    <td className="px-4 py-3 text-blue-600">{professor.email}</td>
                                    <td className="px-4 py-3">{formatScore(professor.similarity_score)}</td>
                                    <td className="px-4 py-3">{professor.skills || "No skills listed"}</td>
                                    <td className="px-4 py-3">
                                        <button 
                                            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
                                            onClick={() => {
                                                console.log("Button clicked for professor:", professor);
                                                assignProfessor(professor._id);
                                            }}
                                            disabled={assigning[professor._id]}
                                        >
                                            {assigning[professor._id] ? "Assigning..." : "Assign"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Similarity;
