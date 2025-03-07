import React, { useEffect, useState } from 'react';
import { useUser } from '../../context/UserContext';

const AssignMentees = ({ courseId, closeDropdown }) => {
    const { user } = useUser();
    const [mentees, setMentees] = useState([]);  
    const [selectedMentees, setSelectedMentees] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchMentees = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/users/mentees/${user._id}`, {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch mentees');
                }

                const data = await response.json();
                console.log("Mentees API Response:", data);  

                if (Array.isArray(data.mentees)) {
                    setMentees(data.mentees);  
                } else {
                    console.error("Mentees API returned a non-array response:", data);
                    setMentees([]);  
                }

            } catch (error) {
                console.error('Error fetching mentees:', error);
                setMentees([]);  
            }
        };

        fetchMentees();
    }, [user._id, user.token]);

    const handleCheckboxChange = (menteeId) => {
        setSelectedMentees(prev =>
            prev.includes(menteeId) 
                ? prev.filter(id => id !== menteeId) 
                : [...prev, menteeId]
        );
    };

    const assignMentees = async () => {
        if (selectedMentees.length === 0) return;
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8000/api/courses/assign/${courseId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                },
                body: JSON.stringify({ menteeIds: selectedMentees })
            });

            if (response.ok) {
                alert("Mentees assigned successfully!");
                closeDropdown();
            } else {
                console.error('Failed to assign mentees');
            }
        } catch (error) {
            console.error('Error assigning mentees:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="absolute left-0 mt-2 bg-white border border-red-500 rounded-lg shadow-lg w-56 p-3 z-50">

            <h4 className="text-lg font-semibold mb-2">Select Mentees</h4>
            <div className="max-h-40 overflow-y-auto">
                {mentees.length > 0 ? (
                    mentees.map(mentee => (
                        <label key={mentee._id} className="flex items-center space-x-2 text-gray-700 mb-1">
                            <input 
                                type="checkbox" 
                                value={mentee._id}  
                                onChange={() => handleCheckboxChange(mentee._id)}
                                checked={selectedMentees.includes(mentee._id)}
                            />
                            <span>{mentee.name}</span>
                        </label>
                    ))
                ) : (
                    <p className="text-gray-500 text-sm">No mentees found</p>
                )}
            </div>

            <button 
                className="w-full mt-3 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                onClick={assignMentees}
                disabled={loading}
            >
                {loading ? "Assigning..." : "Assign"}
            </button>
        </div>
    );
};

export default AssignMentees;
