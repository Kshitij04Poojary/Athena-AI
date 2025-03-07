import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '../../context/UserContext';

const Similarity = () => {
    const { user } = useUser();
    const [professors, setProfessors] = useState(null);
    const [sortField, setSortField] = useState('similarity_score');
    const [sortDirection, setSortDirection] = useState('desc');
    const [loading, setLoading] = useState(false);
    
    // Make sure user exists before accessing user._id
    // console.log(user);

    async function fetchData() {
        try {
            setLoading(true);
            const response = await axios.post(
                "http://127.0.0.1:5004/mentor-mentee/", 
                { "user_id": user?._id },  // Use optional chaining to handle undefined user
                { withCredentials: true }
            );          
            setProfessors(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user]);

    // Handle sorting
    const handleSort = (field) => {
        const newDirection = sortField === field && sortDirection === 'desc' ? 'asc' : 'desc';
        setSortDirection(newDirection);
        setSortField(field);

        if (professors) {
            const sortedData = [...professors].sort((a, b) => {
                if (newDirection === 'asc') {
                    return a[field] > b[field] ? 1 : -1;
                } else {
                    return a[field] < b[field] ? 1 : -1;
                }
            });
            setProfessors(sortedData);
        }
    };

    // Format score as percentage
    const formatScore = (score) => {
        return (score * 100).toFixed(2) + '%';
    };

    // Check if a skill matches any user skill
    const isMatchingSkill = (skill) => {
        return user?.skills?.some(userSkill => 
            userSkill.name.toLowerCase() === skill.trim().toLowerCase()
        );
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-4 bg-gray-50 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Professor Directory</h2>

            {/* User Skills Section */}
            <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold mb-2 text-gray-700">Your Skills</h3>
                <div className="flex flex-wrap gap-2">
                    {user?.skills?.length > 0 ? (
                        user.skills.map((skill) => (
                            <span 
                                key={skill._id} 
                                className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                            >
                                {skill.name}
                            </span>
                        ))
                    ) : (
                        <span className="text-gray-500">No skills listed</span>
                    )}
                </div>
            </div>

            <div className="mb-4 flex justify-between items-center">
                <div className="text-sm text-gray-600">
                    {professors && professors.length} Professors Found
                </div>
                <div className="text-sm text-gray-600">
                    Sorted by: <span className="font-medium">{sortField.replace('_', ' ')}</span>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-6">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full bg-white border border-gray-200 rounded-md">
                        <thead className="bg-gray-100">
                            <tr>
                                <th
                                    className="px-4 py-2 text-left cursor-pointer hover:bg-gray-200"
                                    onClick={() => handleSort('name')}
                                >
                                    Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                                </th>
                                <th
                                    className="px-4 py-2 text-left cursor-pointer hover:bg-gray-200"
                                    onClick={() => handleSort('email')}
                                >
                                    Email {sortField === 'email' && (sortDirection === 'asc' ? '↑' : '↓')}
                                </th>
                                <th
                                    className="px-4 py-2 text-left cursor-pointer hover:bg-gray-200"
                                    onClick={() => handleSort('similarity_score')}
                                >
                                    Match Score {sortField === 'similarity_score' && (sortDirection === 'asc' ? '↑' : '↓')}
                                </th>
                                <th className="px-4 py-2 text-left">
                                    Skills
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {professors && professors.map((professor) => (
                                <tr key={professor._id} className="border-t border-gray-200 hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium">{professor.name}</td>
                                    <td className="px-4 py-3 text-blue-600">{professor.email}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center">
                                            <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                                                <div
                                                    className="bg-blue-600 h-2.5 rounded-full"
                                                    style={{ width: formatScore(professor.similarity_score) }}
                                                ></div>
                                            </div>
                                            <span>{formatScore(professor.similarity_score)}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        {professor.skills ? (
                                            <div className="flex flex-wrap gap-1">
                                                {professor.skills.split(', ').map((skill, index) => {
                                                    const matches = isMatchingSkill(skill);
                                                    return (
                                                        <span
                                                            key={index}
                                                            className={`${
                                                                matches 
                                                                    ? "bg-green-100 text-green-800 border border-green-300" 
                                                                    : "bg-gray-100 text-gray-800"
                                                            } text-xs px-2 py-1 rounded`}
                                                        >
                                                            {skill}
                                                            {matches && (
                                                                <span className="ml-1 text-green-700">✓</span>
                                                            )}
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <span className="text-gray-400 italic">No skills listed</span>
                                        )}
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
