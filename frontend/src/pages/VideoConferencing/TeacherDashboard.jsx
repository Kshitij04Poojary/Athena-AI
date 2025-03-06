import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Clock, Video, Users, BookOpen, Award, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import DashboardCard from '../../components/DashboardCard';
// import { useSocket } from '../../context/SocketContext';

const TeacherDashboard = () => {
    const [lectures, setLectures] = useState([]);
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [mentees, setMentees] = useState([]);
    // const socket=useSocket();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        startTime: '',
        duration: 60
    });

    const [activeTab, setActiveTab] = useState('upcoming');
    const [showLiveModal, setShowLiveModal] = useState(false);
    const [liveFormData, setLiveFormData] = useState({
        title: '',
        duration: 60
    });

    useEffect(() => {
        fetchLectures();
        fetchMentees();
    }, []);

    const fetchLectures = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/lectures/mentor',{
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setLectures(response.data);
        } catch (error) {
            console.error('Error fetching lectures:', error);
        }
    };

    const fetchMentees = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/users/mentor/mentees',{
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setMentees(response.data);
        } catch (error) {
            console.error('Error fetching mentees:', error);
        }
    };

    const handleScheduleLecture = async (e) => {
        e.preventDefault();
        try {
            const res=await axios.post('http://localhost:8000/api/lectures/schedule', 
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            console.log(res);
            setShowScheduleModal(false);
            fetchLectures();
        } catch (error) {
            console.error('Error scheduling lecture:', error);
        }
    };

    const startLecture = async (lecture) => {
        try {
            console.log(lecture);
            // Update lecture status to ongoing
            await axios.put(`http://localhost:8000/api/lectures/status`, {
                lectureId: lecture._id,
                status: 'ongoing'
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
              // Emit lecture started event
            // socket.emit('lecture_started', {
                
            //     roomId: lecture.roomId,
            //     lectureId: lecture._id,
            //     title: lecture.title
            // });
            navigate(`/consultation-room/${lecture.roomId}`);
        } catch (error) {
            console.error('Error starting lecture:', error);
        }
    };

    const startLiveLecture = async (e) => {
        e.preventDefault();
        try {
            const startTime = new Date(); // Current time
            const response = await axios.post('http://localhost:8000/api/lectures/schedule', 
                {
                    ...liveFormData,
                    startTime: startTime.toISOString()
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            // Immediately update status to ongoing
            await axios.put(`http://localhost:8000/api/lectures/status`, {
                lectureId: response.data._id,
                status: 'ongoing'
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            // socket.emit('lecture_started', {
            //     roomId: lecture.roomId,
            //     lectureId: lecture._id,
            //     title: lecture.title
            // });
            setShowLiveModal(false);
            navigate(`/consultation-room/${response.data.roomId}`);
        } catch (error) {
            console.error('Error starting live lecture:', error);
        }
    };

    const stats = [
        { icon: <Users className="text-blue-500" />, label: "Total Students", value: mentees.length },
        { icon: <BookOpen className="text-green-500" />, label: "Upcoming Lectures", value: lectures.filter(l => l.status === 'scheduled').length },
        { icon: <Video className="text-purple-500" />, label: "Completed Lectures", value: lectures.filter(l => l.status === 'completed').length },
        { icon: <Award className="text-yellow-500" />, label: "Hours Taught", value: lectures.reduce((acc, lecture) => acc + (lecture.duration / 60), 0).toFixed(1) }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">    <div className="w-full px-4 py-8">
                 <div className="container mx-auto px-4 py-8">
                    {/* Header section with both buttons */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-500 dark:text-white mb-2">Educator Dashboard</h1>
                        <p className="text-gray-500 dark:text-gray-300">Manage your teaching sessions</p>
                    </div>
                        <div className="flex gap-4">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowLiveModal(true)}
                                className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:shadow-lg transition-all"
                            >
                                <Play size={20} />
                                Start Live Lecture
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowScheduleModal(true)}
                                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:shadow-lg transition-all"
                            >
                                <Calendar size={20} />
                                Schedule Lecture
                            </motion.button>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      {stats.map((stat, index) => (
        <DashboardCard key={index} className="p-5 bg-opacity-90 hover:bg-opacity-100">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-white/10">
              {stat.icon}
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-300">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{stat.value}</p>
            </div>
          </div>
        </DashboardCard>
      ))}
    </div>


                    {/* Main Content */}
                    <div className="space-y-6">
                        {/* Tabs */}
                        <div className="flex gap-4 border-b">
                            {['upcoming', 'past', 'analytics'].map(tab => (
                                <button
                                    key={tab}
                                    className={`px-4 py-2 font-medium ${
                                        activeTab === tab 
                                            ? 'text-blue-600 border-b-2 border-blue-600' 
                                            : 'text-gray-600'
                                    }`}
                                    onClick={() => setActiveTab(tab)}
                                >
                                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div className="bg-white rounded-xl shadow-md p-6">
                            {/* Content based on active tab */}
                            {activeTab === 'upcoming' && (
                                 <DashboardCard className="p-6 lecture-list-container">
                                 <h2 className="text-2xl font-semibold mb-6 text-blue-600 dark:text-blue-400">
                                   <BookOpen size={24} className="mr-2 inline-block" />
                                   Scheduled Sessions
                                 </h2>
                                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                                        {lectures
                                            .filter(l => l.status === 'scheduled')
                                            .map(lecture => (
                                                <motion.div
                                                    key={lecture._id}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    className="border border-gray-100 rounded-lg p-4 hover:border-blue-200 transition-colors"
                                                >
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h3 className="font-semibold">{lecture.title}</h3>
                                                            <p className="text-sm text-gray-600">
                                                                {format(new Date(lecture.startTime), "MMM d, yyyy 'at' h:mm a")}
                                                            </p>
                                                            <p className="text-sm text-gray-600">
                                                                Duration: {lecture.duration} minutes
                                                            </p>
                                                            <p className="text-sm text-gray-600">
                                                                Student: {lecture.mentee.name}
                                                            </p>
                                                        </div>
                                                        <button
                                                            onClick={() => startLecture(lecture)}
                                                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                                                        >
                                                            Start
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            ))}
                                    </div>
                                </DashboardCard>
                            )}

                            {activeTab === 'past' && (
                                <DashboardCard className="p-6">
                                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                        <Video size={24} className="text-purple-600" />
                                        Past Lectures
                                    </h2>
                                    <div className="space-y-4">
                                        {lectures.filter(l => l.status === 'completed').map(lecture => (
                                            <div key={lecture._id} className="border rounded-lg p-4">
                                                <h3 className="font-semibold">{lecture.title}</h3>
                                                <p className="text-sm text-gray-600">
                                                    {format(new Date(lecture.startTime), "MMM d, yyyy 'at' h:mm a")}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    Student: {lecture.mentee.name}
                                                </p>
                                                {lecture.recordingUrl && (
                                                    <a
                                                        href={lecture.recordingUrl}
                                                        className="text-blue-600 hover:underline text-sm inline-block mt-2"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        View Recording
                                                    </a>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </DashboardCard>
                            )}

                            {activeTab === 'analytics' && (
                                <DashboardCard className="p-6">
                                    <h2 className="text-xl font-semibold mb-6">Analytics</h2>
                                    {/* Add analytics charts and metrics */}
                                </DashboardCard>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Live Modal */}
            {showLiveModal && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-xl p-6 w-full max-w-md m-4"
                    >
                        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                            <Play className="text-red-600" size={24} />
                            Start Live Lecture
                        </h2>
                        <form onSubmit={startLiveLecture} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    value={liveFormData.title}
                                    onChange={(e) => setLiveFormData({...liveFormData, title: e.target.value})}
                                    className="w-full p-2 border rounded-lg"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Estimated Duration (minutes)
                                </label>
                                <input
                                    type="number"
                                    value={liveFormData.duration}
                                    onChange={(e) => setLiveFormData({...liveFormData, duration: e.target.value})}
                                    className="w-full p-2 border rounded-lg"
                                    required
                                    min="15"
                                    step="15"
                                />
                            </div>
                            <div className="flex justify-end gap-4 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowLiveModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                >
                                    Start Now
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}

            {/* Schedule Modal */}
            {showScheduleModal && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-xl p-6 w-full max-w-md m-4"
                    >
                        <h2 className="text-2xl font-semibold mb-4">Schedule New Lecture</h2>
                        <form onSubmit={handleScheduleLecture} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                                    className="w-full p-2 border rounded-lg"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Start Time
                                </label>
                                <input
                                    type="datetime-local"
                                    value={formData.startTime}
                                    onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                                    className="w-full p-2 border rounded-lg"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Duration (minutes)
                                </label>
                                <input
                                    type="number"
                                    value={formData.duration}
                                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                                    className="w-full p-2 border rounded-lg"
                                    required
                                    min="15"
                                    step="15"
                                />
                            </div>
                            <div className="flex justify-end gap-4 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowScheduleModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Schedule
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
};

export default TeacherDashboard;
