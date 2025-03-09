import React, { useEffect, useState } from 'react';
import { useUser } from '../../context/UserContext';

function OfflineAttendance() {
    const [lectureName, setLectureName] = useState('');
    const [mentees, setMentees] = useState([]);
    const [attendanceList, setAttendanceList] = useState([]);
    const { user } = useUser();

    // ✅ Fetch all mentees from Mentor ID
    useEffect(() => {
        const fetchMentees = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/lectures/mentees/${user._id}`);
                if (!response.ok) throw new Error('Failed to fetch mentees');
                const data = await response.json();
                setMentees(data);
            } catch (error) {
                console.error('Error fetching mentees:', error);
            }
        };

        fetchMentees();
    }, [user._id]);

    // ✅ Handle Attendance (Add to attendance list)
    const handleAttendance = (menteeId, status) => {
        if (status === 'present') {
            if (!attendanceList.includes(menteeId)) {
                setAttendanceList((prev) => [...prev, menteeId]);
            }
        } else {
            setAttendanceList((prev) => prev.filter(id => id !== menteeId));
        }
    };

    // ✅ Submit Lecture with Attendance
    const handleSubmit = async () => {
        const lectureData = {
            title: lectureName,
            startTime: new Date(),
            duration: 60,
            mentorId: user._id,
            attendanceList
        };

        try {
            const response = await fetch('http://localhost:8000/api/lectures/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(lectureData)
            });

            const data = await response.json();
            if (response.ok) {
                alert('Lecture created successfully!');
            } else {
                alert(data.error || 'Failed to create lecture.');
            }
        } catch (error) {
            console.error('Error creating lecture:', error);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Create Offline Attendance</h2>

            {/* Lecture Name */}
            <input
                type="text"
                value={lectureName}
                onChange={(e) => setLectureName(e.target.value)}
                placeholder="Lecture Name"
                className="border w-full p-2 mb-4"
            />

            {/* Mentor Name */}
            <p className="font-semibold mb-4">
                Mentor: <span className="text-blue-600">{user.name}</span>
            </p>

            {/* Attendance List */}
            {mentees.map((mentee) => (
                <div key={mentee._id} className="flex items-center justify-between mb-2">
                    <p>{mentee.name}</p>
                    <div className="space-x-2">
                        <button
                            className={`px-4 py-1 rounded-lg ${attendanceList.includes(mentee._id) ? 'bg-green-500' : 'bg-gray-300'}`}
                            onClick={() => handleAttendance(mentee._id, 'present')}
                        >
                            Present
                        </button>

                        <button
                            className="bg-red-500 text-white px-4 py-1 rounded-lg"
                            // onClick={() => handleAttendance(mentee._id, 'absent')}
                        >
                            Absent
                        </button>
                    </div>
                </div>
            ))}

            {/* Confirm Button */}
            <button
                onClick={handleSubmit}
                className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-lg w-full"
            >
                Confirm Attendance
            </button>
        </div>
    );
}

export default OfflineAttendance;
