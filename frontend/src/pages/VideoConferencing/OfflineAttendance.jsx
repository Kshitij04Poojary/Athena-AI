import React, { useEffect, useState } from 'react';
import { useUser } from '../../context/UserContext';
import { toast, ToastContainer } from 'react-toastify'; // Import from react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import toastify CSS

function OfflineAttendance() {
    const [lectureName, setLectureName] = useState('');
    const [mentees, setMentees] = useState([]);
    const [attendanceList, setAttendanceList] = useState([]);
    const { user } = useUser();
    const [loading, setLoading] = useState(true);

    // ✅ Fetch all mentees from Mentor ID
    useEffect(() => {
        if (!user?._id) return;  // ✅ Prevent fetching if user is null
        
        const fetchMentees = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/lectures/mentees/${user._id}`);
                if (!response.ok) throw new Error('Failed to fetch mentees');
                const data = await response.json();
                setMentees(data);
                console.log("Mentees: ",data); // Log the data to verify the structure
            } catch (error) {
                console.error('Error fetching mentees:', error);
                toast.error('Failed to load mentees. Please try again.', {
                    position: "top-right",
                    autoClose: 3000
                });
            } finally {
                setLoading(false);
            }
        };

        fetchMentees();
    }, [user?._id]);

    // ✅ Handle Attendance (Add to attendance list)
    const handleAttendance = (menteeId, status) => {
        if (status === 'present') {
            if (!attendanceList.includes(menteeId)) {
                setAttendanceList((prev) => [...prev, menteeId]);
                toast.success('Marked as present', { 
                    position: "top-right",
                    autoClose: 1500
                });
            }
        } else {
            setAttendanceList((prev) => prev.filter(id => id !== menteeId));
            toast.info('Marked as absent', { 
                position: "top-right",
                autoClose: 1500
            });
        }
    };

    // ✅ Submit Lecture with Attendance
    const handleSubmit = async () => {
        if (!lectureName.trim()) {
            toast.warn('Please enter a lecture name', {
                position: "top-right",
                autoClose: 3000
            });
            return;
        }

        const lectureData = {
            title: lectureName,
            startTime: new Date(),
            duration: 60,
            roomId: Math.random().toString(36).substring(2, 9),
            mentorId: user._id,
            attendanceList
        };

        // Show loading toast
        const toastId = toast.loading('Creating lecture...', {
            position: "top-center"
        });

        try {
            console.log("Lecture Data: ",lectureData);
            const response = await fetch('http://localhost:8000/api/lectures/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(lectureData)
            });

            const data = await response.json();
            
            // Update the loading toast with success or error
            if (response.ok) {
                toast.update(toastId, {
                    render: "Lecture created successfully!",
                    type: "success",
                    isLoading: false,
                    autoClose: 3000
                });
                // Reset form after successful submission
                setLectureName('');
                setAttendanceList([]);
            } else {
                toast.update(toastId, {
                    render: data.error || "Failed to create lecture.",
                    type: "error",
                    isLoading: false,
                    autoClose: 3000
                });
            }
        } catch (error) {
            console.error('Error creating lecture:', error);
            toast.update(toastId, {
                render: "Connection error. Please check your network.",
                type: "error",
                isLoading: false,
                autoClose: 3000
            });
        }
    };

    // ✅ Show Loading State until User is fetched
    if (loading || !user) {
        return (
            <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto relative">
                        <div className="absolute inset-0 rounded-full border-4 border-indigo-100 opacity-25"></div>
                        <div className="absolute inset-0 rounded-full border-t-4 border-indigo-500 animate-spin"></div>
                    </div>
                    <p className="mt-6 text-indigo-600 font-medium">Preparing attendance sheet...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto my-10 overflow-hidden bg-white rounded-2xl shadow-xl">
            {/* Toast Container */}
            <ToastContainer />
            
            {/* Header Section with Gradient */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-8 text-white">
                <h2 className="text-3xl font-bold tracking-tight">Attendance Manager</h2>
                <p className="mt-2 opacity-90">Create and manage attendance for your offline sessions</p>
            </div>

            <div className="p-8">
                {/* Lecture Info Section */}
                <div className="mb-8">
                    <div className="relative">
                        <input
                            type="text"
                            id="lectureName"
                            value={lectureName}
                            onChange={(e) => setLectureName(e.target.value)}
                            placeholder=" "
                            className="peer w-full px-4 pt-6 pb-2 border-0 border-b-2 border-gray-300 bg-gray-50 rounded-t-lg focus:ring-0 focus:border-indigo-500 transition-all"
                        />
                        <label 
                            htmlFor="lectureName" 
                            className="absolute top-2 left-4 text-xs font-medium text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs"
                        >
                            Lecture Name
                        </label>
                    </div>
                </div>
                
                {/* Mentor Section */}
                <div className="mb-8 flex items-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                        {user.name.charAt(0)}
                    </div>
                    <div className="ml-4">
                        <span className="block text-sm font-medium text-gray-500">Mentor</span>
                        <span className="block text-lg font-semibold text-gray-800">{user.name}</span>
                    </div>
                    <div className="ml-auto px-4 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                        {new Date().toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                        })}
                    </div>
                </div>

                {/* Attendance Summary Cards */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl shadow-sm">
                        <span className="text-blue-600 text-sm font-medium">Total Mentees</span>
                        <div className="mt-2 flex items-baseline">
                            <span className="text-2xl font-bold text-gray-800">{mentees.length}</span>
                            <span className="ml-1 text-gray-500 text-xs">students</span>
                        </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl shadow-sm">
                        <span className="text-green-600 text-sm font-medium">Present</span>
                        <div className="mt-2 flex items-baseline">
                            <span className="text-2xl font-bold text-gray-800">{attendanceList.length}</span>
                            <span className="ml-1 text-gray-500 text-xs">students</span>
                        </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-xl shadow-sm">
                        <span className="text-amber-600 text-sm font-medium">Absent</span>
                        <div className="mt-2 flex items-baseline">
                            <span className="text-2xl font-bold text-gray-800">{mentees.length - attendanceList.length}</span>
                            <span className="ml-1 text-gray-500 text-xs">students</span>
                        </div>
                    </div>
                </div>

                {/* Mentees List */}
                <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Mentees</h3>
                    
                    {mentees.length === 0 ? (
                        <div className="text-center p-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                            <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                            </svg>
                            <p className="mt-4 text-gray-500">No mentees assigned to this session</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {mentees.map((mentee) => (
                                <div 
                                    key={mentee.id} 
                                    className={`flex items-center p-4 rounded-xl transition-all ${
                                        attendanceList.includes(mentee.id) 
                                            ? 'bg-green-50 border-l-4 border-green-500 shadow-sm' 
                                            : 'bg-gray-50 hover:bg-gray-100'
                                    }`}
                                >
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium shadow-sm ${
                                        attendanceList.includes(mentee.id) 
                                            ? 'bg-gradient-to-br from-green-500 to-emerald-600' 
                                            : 'bg-gradient-to-br from-gray-500 to-gray-600'
                                    }`}>
                                        {mentee.name.charAt(0)}
                                    </div>
                                    
                                    <div className="ml-3 flex-grow">
                                        <p className="font-medium text-gray-800">{mentee.name}</p>
                                    </div>
                                    
                                    <div className="flex space-x-2">
                                        <button
                                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                                                attendanceList.includes(mentee.id) 
                                                    ? 'bg-green-500 text-white shadow-sm hover:bg-green-600' 
                                                    : 'bg-white border border-gray-300 hover:bg-gray-50'
                                            }`}
                                            onClick={() => handleAttendance(mentee.id, 'present')}
                                        >
                                            Present
                                        </button>

                                        <button
                                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                                                !attendanceList.includes(mentee.id) 
                                                    ? 'bg-red-500 text-white shadow-sm hover:bg-red-600' 
                                                    : 'bg-white border border-gray-300 hover:bg-gray-50'
                                            }`}
                                            onClick={() => handleAttendance(mentee.id, 'absent')}
                                        >
                                            Absent
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Submit Button */}
                <button
                    onClick={handleSubmit}
                    disabled={!lectureName.trim()}
                    className={`w-full py-3.5 rounded-xl text-white font-medium transition-all ${
                        lectureName.trim() 
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5' 
                            : 'bg-gray-300 cursor-not-allowed'
                    }`}
                >
                    Submit Attendance
                </button>
            </div>
        </div>
    );
}

export default OfflineAttendance;