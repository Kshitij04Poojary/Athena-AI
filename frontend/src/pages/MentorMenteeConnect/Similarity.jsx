import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../../context/UserContext";

const Similarity = () => {
    const { user } = useUser(); // Assuming the admin is logged in
    const [selectedMenteeId, setSelectedMenteeId] = useState("");
    const [professors, setProfessors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [assigning, setAssigning] = useState({});
    const [mentees, setMentees] = useState([]); // Initialize as an empty array to prevent issues

    // Find the selected mentee (Only if mentees are available)
    const selectedMentee = mentees.length > 0 ? mentees.find(mentee => mentee._id === selectedMenteeId) : null;

    // Fetch mentees from API
    async function fetchMentees() {
        try {
            setLoading(true);
            const response = await axios.get("http://127.0.0.1:5004/users/all-mentees", { withCredentials: true });

            console.log("Fetched mentees:", response.data);
            if (response.data && response.data.mentees) {
                setMentees(response.data.mentees);
            }
        } catch (error) {
            console.error("Error fetching mentees:", error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchMentees();
    }, []);

    useEffect(() => {
        if (selectedMenteeId) {
            fetchProfessors();
        }
    }, [selectedMenteeId]);

    async function fetchProfessors() {
        try {
            setLoading(true);
            const response = await axios.post(
                "http://127.0.0.1:5004/mentor-mentee/",
                { "user_id": selectedMenteeId },
                { withCredentials: true }
            );
            console.log("Fetched Professors:", response.data);
            setProfessors(response.data);
        } catch (error) {
            console.error("Error fetching professors:", error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    }

    const assignProfessor = async (professorId) => {
        if (!selectedMenteeId) {
            alert("Please select a mentee first.");
            return;
        }

        setAssigning((prev) => ({ ...prev, [professorId]: true }));

        try {
            const response = await axios.post(
                "http://localhost:8000/api/assign/assign-mentee",
                { menteeId: selectedMenteeId, mentorId: professorId },
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

    const formatScore = (score) => (score * 100).toFixed(2) + "%";

    return (
        <div className="w-full max-w-4xl mx-auto p-4 bg-gray-50 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Professor Directory</h2>

            {/* Mentee Selection Dropdown */}
            <div className="mb-4">
                <label className="block text-lg font-medium text-gray-700">Select Mentee:</label>
                <select
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200"
                    value={selectedMenteeId}
                    onChange={(e) => setSelectedMenteeId(e.target.value)}
                >
                    <option value="">-- Select a Mentee --</option>
                    {mentees.map((mentee) => (
                        <option key={mentee._id} value={mentee._id}>
                            {mentee.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Display Mentee Skills */}
            {selectedMentee && (
                <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-700">Mentee Skills:</h3>
                    {selectedMentee.skills.length > 0 ? (
                        <ul className="list-disc pl-5 text-gray-600">
                            {selectedMentee.skills.map((skill, index) => (
                                <li key={index}>{skill.name}</li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">No skills listed.</p>
                    )}
                </div>
            )}

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
                            {professors.length > 0 ? (
                                professors.map((professor) => (
                                    <tr key={professor._id} className="border-t border-gray-200 hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium">{professor.name}</td>
                                        <td className="px-4 py-3 text-blue-600">{professor.email}</td>
                                        <td className="px-4 py-3">{formatScore(professor.similarity_score)}</td>
                                        <td className="px-4 py-3">{professor.skills || "No skills listed"}</td>
                                        <td className="px-4 py-3">
                                            <button
                                                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
                                                onClick={() => assignProfessor(professor._id)}
                                                disabled={assigning[professor._id] || !selectedMenteeId}
                                            >
                                                {assigning[professor._id] ? "Assigning..." : "Assign"}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-4">
                                        No professors available for the selected mentee.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Similarity;
