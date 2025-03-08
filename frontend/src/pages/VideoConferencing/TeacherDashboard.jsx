import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Clock, Video, Users, BookOpen, Award, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import DashboardCard from '../../components/DashboardCard';
import './Style.css';
// import "./Style.css"; - We'll now use the consolidated styles

const TeacherDashboard = () => {
    const [lectures, setLectures] = useState([]);
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [mentees, setMentees] = useState([]);
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
            const res = await axios.post('http://localhost:8000/api/lectures/schedule', 
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
        <div className="min-h-screen teacher-dashboard">
            <div className="w-full px-6 py-8">
                <div className="max-w-7xl mx-auto">
                    {/* Enhanced Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                        <div className="glass-card p-6 rounded-2xl w-full md:w-auto">
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                Welcome, Educator
                            </h1>
                            <p className="text-gray-600 mt-2">
                                Inspiring minds, one lecture at a time
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setShowLiveModal(true)}
                                className="live-button text-white px-8 py-4 rounded-xl flex items-center gap-3 transform hover:-translate-y-1 transition-all"
                            >
                                <div className="relative">
                                    <Play size={24} />
                                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
                                </div>
                                Start Live Session
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setShowScheduleModal(true)}
                                className="gradient-button text-white px-8 py-4 rounded-xl flex items-center gap-3"
                            >
                                <Calendar size={24} />
                                Schedule Session
                            </motion.button>
                        </div>
                    </div>

                    {/* Enhanced Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="glass-card stat-card p-6 rounded-xl"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-4 rounded-lg bg-gradient-to-br from-indigo-50 to-white">
                                        {stat.icon}
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">{stat.label}</p>
                                        <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Enhanced Content Tabs */}
                    <div className="glass-card rounded-xl p-8">
                        <div className="flex gap-4 mb-8">
                            {['upcoming', 'past', 'analytics'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`tab-button ${activeTab === tab ? 'active' : ''}`}
                                >
                                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content Container */}
                        <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6">
                            {/* Tab Content */}
                            {activeTab === 'upcoming' && (
                                <div className="space-y-6">
                                    {lectures
                                        .filter(l => l.status === 'scheduled')
                                        .map((lecture, index) => (
                                            <motion.div
                                                key={lecture._id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="lecture-card glass-card p-6 rounded-xl hover:shadow-lg transition-all"
                                            >
                                                <div className="flex justify-between items-center">
                                                    <div className="space-y-2">
                                                        <h3 className="text-xl font-semibold text-gray-800">
                                                            {lecture.title}
                                                        </h3>
                                                        <div className="flex items-center gap-4 text-sm text-gray-600">
                                                            <div className="flex items-center gap-2">
                                                                <Clock size={16} />
                                                                {format(new Date(lecture.startTime), "MMM d, yyyy 'at' h:mm a")}
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Users size={16} />
                                                                {lecture.mentee.length} Students
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => startLecture(lecture)}
                                                        className="gradient-button px-6 py-3 rounded-lg text-white font-medium"
                                                    >
                                                        Start Session
                                                    </motion.button>
                                                </div>
                                            </motion.div>
                                        ))}
                                </div>
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
                    className="fixed inset-0 modal-overlay flex items-center justify-center z-50 p-4"
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="modal-content w-full max-w-md rounded-2xl overflow-hidden"
                    >
                        <div className="modal-header p-6">
                            <h2 className="text-2xl font-semibold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                                Start Live Session
                            </h2>
                            <p className="text-gray-600 mt-1">Begin teaching in real-time</p>
                        </div>
                        
                        <form onSubmit={startLiveLecture} className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Session Title
                                </label>
                                <input
                                    type="text"
                                    value={liveFormData.title}
                                    onChange={(e) => setLiveFormData({...liveFormData, title: e.target.value})}
                                    className="modal-input w-full p-3 rounded-lg text-gray-800"
                                    placeholder="Enter session title"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Estimated Duration
                                </label>
                                <select
                                    value={liveFormData.duration}
                                    onChange={(e) => setLiveFormData({...liveFormData, duration: Number(e.target.value)})}
                                    className="modal-input w-full p-3 rounded-lg text-gray-800"
                                    required
                                >
                                    <option value={30}>30 minutes</option>
                                    <option value={45}>45 minutes</option>
                                    <option value={60}>1 hour</option>
                                    <option value={90}>1.5 hours</option>
                                    <option value={120}>2 hours</option>
                                </select>
                            </div>

                            <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
                                <motion.button
                                    type="button"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setShowLiveModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    type="submit"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="live-button px-6 py-2 text-white rounded-lg font-medium flex items-center gap-2"
                                >
                                    <Play size={18} />
                                    Go Live
                                </motion.button>
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
                    className="fixed inset-0 modal-overlay flex items-center justify-center z-50 p-4"
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="modal-content w-full max-w-md rounded-2xl overflow-hidden"
                    >
                        <div className="modal-header p-6">
                            <h2 className="text-2xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                Schedule New Lecture
                            </h2>
                            <p className="text-gray-600 mt-1">Plan your next teaching session</p>
                        </div>
                        
                        <form onSubmit={handleScheduleLecture} className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Lecture Title
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                                    className="modal-input w-full p-3 rounded-lg text-gray-800"
                                    placeholder="Enter lecture title"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Start Time
                                </label>
                                <input
                                    type="datetime-local"
                                    value={formData.startTime}
                                    onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                                    className="modal-input w-full p-3 rounded-lg text-gray-800"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Duration (minutes)
                                </label>
                                <select
                                    value={formData.duration}
                                    onChange={(e) => setFormData({...formData, duration: Number(e.target.value)})}
                                    className="modal-input w-full p-3 rounded-lg text-gray-800"
                                    required
                                >
                                    <option value={30}>30 minutes</option>
                                    <option value={45}>45 minutes</option>
                                    <option value={60}>1 hour</option>
                                    <option value={90}>1.5 hours</option>
                                    <option value={120}>2 hours</option>
                                </select>
                            </div>

                            <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
                                <motion.button
                                    type="button"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setShowScheduleModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    type="submit"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="gradient-button px-6 py-2 text-white rounded-lg font-medium"
                                >
                                    Schedule Lecture
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
};

export default TeacherDashboard;