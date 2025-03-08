import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Clock, Video, Users, BookOpen, Award, Play, ArrowRight, Sparkles, ChevronRight, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import DashboardCard from '../../components/DashboardCard';

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

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { 
                staggerChildren: 0.1 
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { 
            y: 0, 
            opacity: 1,
            transition: { type: "spring", stiffness: 300, damping: 24 }
        }
    };

    const fadeIn = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.6 } }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50">
            <div className="w-full px-6 py-8">
                <div className="max-w-7xl mx-auto">
                    {/* Enhanced Header with Glassmorphism */}
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6"
                    >
                        <div className="bg-white/80 backdrop-blur-xl border border-white/30 shadow-lg shadow-indigo-100/30 p-8 rounded-3xl w-full md:w-auto">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
                                    <Sparkles size={20} className="text-white" />
                                </div>
                                <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    Welcome, Educator
                                </h1>
                            </div>
                            <p className="text-gray-600 mt-3 ml-13 pl-1">
                                Inspiring minds, one lecture at a time
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <motion.button
                                whileHover={{ scale: 1.03, boxShadow: "0 8px 25px rgba(220,38,38,0.35)" }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setShowLiveModal(true)}
                                className="bg-gradient-to-br from-red-500 to-rose-600 shadow-xl shadow-red-200 text-white px-8 py-4 rounded-2xl flex items-center gap-3 transform transition-all duration-300"
                            >
                                <div className="relative">
                                    <Play size={24} className="text-white" />
                                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-ping" />
                                </div>
                                Start Live Session
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.03, boxShadow: "0 8px 25px rgba(79,70,229,0.35)" }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setShowScheduleModal(true)}
                                className="bg-gradient-to-br from-indigo-500 to-violet-600 shadow-xl shadow-indigo-200 text-white px-8 py-4 rounded-2xl flex items-center gap-3 transform transition-all duration-300"
                            >
                                <Calendar size={24} />
                                Schedule Session
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* Enhanced Stats Grid with staggered animation */}
                    <motion.div 
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                className="bg-white/80 backdrop-blur-xl border border-white/30 shadow-lg shadow-indigo-100/20 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-100/30 hover:-translate-y-1 group relative overflow-hidden p-8 rounded-2xl"
                            >
                                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 group-hover:scale-110 transition-transform duration-500"></div>
                                <div className="flex items-center gap-5 relative z-10">
                                    <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-white border border-indigo-100/50">
                                        {stat.icon}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                                        <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Enhanced Content Tabs with smooth transitions */}
                    <motion.div 
                        variants={fadeIn}
                        initial="hidden"
                        animate="visible"
                        className="bg-white/80 backdrop-blur-xl border border-white/30 shadow-lg shadow-indigo-100/20 rounded-3xl p-8"
                    >
                        <div className="flex flex-wrap gap-4 mb-8">
                            {['upcoming', 'past', 'analytics'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`relative py-3 px-6 font-medium transition-all duration-300 rounded-xl ${
                                        activeTab === tab 
                                        ? 'text-white bg-gradient-to-br from-indigo-500 to-violet-600 shadow-xl shadow-indigo-200/40 hover:shadow-indigo-200/60' 
                                        : 'bg-white/50 backdrop-blur-sm border border-indigo-100/30 text-gray-600 hover:text-indigo-600 hover:border-indigo-200 hover:bg-white/80'
                                    }`}
                                >
                                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                    {activeTab === tab && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute inset-0 rounded-xl"
                                            initial={false}
                                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                        />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content Container */}
                        <div className="bg-white/50 backdrop-blur-lg rounded-2xl p-6 border border-white/60 shadow-inner">
                            {/* Tab Content */}
                            {activeTab === 'upcoming' && (
                                <motion.div 
                                    className="space-y-6"
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    {lectures
                                        .filter(l => l.status === 'scheduled')
                                        .length > 0 ? (
                                            lectures
                                                .filter(l => l.status === 'scheduled')
                                                .map((lecture, index) => (
                                                    <motion.div
                                                        key={lecture._id}
                                                        variants={itemVariants}
                                                        className="bg-white/90 backdrop-blur-xl border border-indigo-100/30 shadow-lg shadow-indigo-100/10 hover:shadow-indigo-100/20 p-6 rounded-2xl hover:-translate-y-1 transition-all duration-300 group"
                                                    >
                                                        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                                                            <div className="space-y-3">
                                                                <div className="flex items-center">
                                                                    <div className="h-8 w-2 rounded-full bg-indigo-500 mr-3"></div>
                                                                    <h3 className="text-xl font-semibold text-gray-800">
                                                                        {lecture.title}
                                                                    </h3>
                                                                </div>
                                                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                                                    <div className="flex items-center gap-2 bg-indigo-50 py-1 px-3 rounded-full">
                                                                        <Clock size={14} className="text-indigo-500" />
                                                                        {format(new Date(lecture.startTime), "MMM d, yyyy 'at' h:mm a")}
                                                                    </div>
                                                                    <div className="flex items-center gap-2 bg-indigo-50 py-1 px-3 rounded-full">
                                                                        <Users size={14} className="text-indigo-500" />
                                                                        {lecture.mentee.length} Students
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <motion.button
                                                                whileHover={{ scale: 1.03 }}
                                                                whileTap={{ scale: 0.97 }}
                                                                onClick={() => startLecture(lecture)}
                                                                className="bg-gradient-to-br from-indigo-500 to-violet-600 transition-all duration-300 shadow-lg shadow-indigo-200/40 hover:shadow-xl hover:shadow-indigo-200/60 px-6 py-3 rounded-xl text-white font-medium flex items-center gap-2 whitespace-nowrap"
                                                            >
                                                                Start Session
                                                                <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                                                            </motion.button>
                                                        </div>
                                                    </motion.div>
                                                ))
                                        ) : (
                                            <motion.div 
                                                variants={itemVariants}
                                                className="bg-white/90 backdrop-blur-xl border border-dashed border-indigo-200 p-10 rounded-2xl text-center"
                                            >
                                                <Calendar size={48} className="mx-auto text-indigo-300 mb-4" />
                                                <h3 className="text-xl font-medium text-gray-600 mb-2">No upcoming sessions</h3>
                                                <p className="text-gray-500 mb-6">Schedule your next teaching session to get started</p>
                                                <motion.button
                                                    whileHover={{ scale: 1.03 }}
                                                    whileTap={{ scale: 0.97 }}
                                                    onClick={() => setShowScheduleModal(true)}
                                                    className="bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-200/40 px-6 py-3 rounded-xl text-white font-medium inline-flex items-center gap-2"
                                                >
                                                    <Calendar size={18} />
                                                    Schedule Now
                                                </motion.button>
                                            </motion.div>
                                        )}
                                </motion.div>
                            )}

                            {activeTab === 'past' && (
                                <motion.div
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    <div className="flex items-center gap-3 mb-6">
                                        <Video size={24} className="text-purple-600" />
                                        <h2 className="text-xl font-semibold">Past Lectures</h2>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {lectures.filter(l => l.status === 'completed').length > 0 ? (
                                            lectures.filter(l => l.status === 'completed').map((lecture, index) => (
                                                <motion.div 
                                                    key={lecture._id} 
                                                    variants={itemVariants}
                                                    className="bg-white/90 backdrop-blur-xl border border-indigo-100/30 rounded-2xl p-5 shadow-lg shadow-indigo-100/10 hover:-translate-y-1 hover:shadow-indigo-100/20 transition-all duration-300"
                                                >
                                                    <div className="flex justify-between items-start mb-3">
                                                        <h3 className="font-semibold text-gray-800">{lecture.title}</h3>
                                                        <div className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
                                                            <Check size={12} />
                                                            Completed
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2 mb-3">
                                                        <div className="flex items-center text-sm text-gray-600">
                                                            <Clock size={14} className="mr-2 text-gray-500" />
                                                            {format(new Date(lecture.startTime), "MMM d, yyyy 'at' h:mm a")}
                                                        </div>
                                                        <div className="flex items-center text-sm text-gray-600">
                                                            <Users size={14} className="mr-2 text-gray-500" />
                                                            Student: {lecture.mentee.name}
                                                        </div>
                                                    </div>
                                                    {lecture.recordingUrl && (
                                                        <a
                                                            href={lecture.recordingUrl}
                                                            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium text-sm mt-3 bg-indigo-50 rounded-lg p-2 hover:bg-indigo-100 transition-all"
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            <Video size={16} />
                                                            View Recording
                                                            <ChevronRight size={16} />
                                                        </a>
                                                    )}
                                                </motion.div>
                                            ))
                                        ) : (
                                            <motion.div 
                                                variants={itemVariants}
                                                className="bg-white/90 backdrop-blur-xl border border-dashed border-indigo-200 p-8 rounded-2xl text-center col-span-2"
                                            >
                                                <Video size={48} className="mx-auto text-indigo-300 mb-4" />
                                                <h3 className="text-xl font-medium text-gray-600 mb-2">No completed sessions yet</h3>
                                                <p className="text-gray-500">Your completed teaching sessions will appear here</p>
                                            </motion.div>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'analytics' && (
                                <motion.div
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                    className="p-6"
                                >
                                    <div className="flex items-center gap-3 mb-6">
                                        <Sparkles size={24} className="text-indigo-600" />
                                        <h2 className="text-xl font-semibold">Analytics Dashboard</h2>
                                    </div>
                                    
                                    <motion.div variants={itemVariants} className="bg-white/90 backdrop-blur-xl border border-dashed border-indigo-200 p-10 rounded-2xl text-center">
                                        <Sparkles size={48} className="mx-auto text-indigo-300 mb-4" />
                                        <h3 className="text-xl font-medium text-gray-600 mb-2">Analytics Coming Soon</h3>
                                        <p className="text-gray-500">We're building powerful insights for your teaching sessions</p>
                                    </motion.div>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
                       
            {/* Live Modal with enhanced design */}
            {showLiveModal && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 backdrop-blur-lg bg-indigo-900/20 flex items-center justify-center z-50 p-4"
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="bg-white/95 backdrop-blur-xl border border-white/30 shadow-2xl shadow-indigo-200/30 w-full max-w-md rounded-3xl overflow-hidden"
                    >
                        <div className="bg-gradient-to-br from-red-500/5 to-rose-500/10 border-b border-red-100 p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center">
                                    <Play size={16} className="text-white ml-0.5" />
                                </div>
                                <h2 className="text-2xl font-semibold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
                                    Start Live Session
                                </h2>
                            </div>
                            <p className="text-gray-600 ml-11">Begin teaching in real-time</p>
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
                                    className="bg-white border border-red-100 transition-all duration-300 focus:border-red-300 focus:ring-4 focus:ring-red-100 focus:outline-none w-full p-3 rounded-xl text-gray-800"
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
                                    className="bg-white border border-red-100 transition-all duration-300 focus:border-red-300 focus:ring-4 focus:ring-red-100 focus:outline-none w-full p-3 rounded-xl text-gray-800"
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
                                    whileHover={{ scale: 1.03, boxShadow: "0 8px 25px rgba(220,38,38,0.35)" }}
                                    whileTap={{ scale: 0.97 }}
                                    className="bg-gradient-to-br from-red-500 to-rose-600 shadow-lg shadow-red-200/50 hover:shadow-xl hover:shadow-red-200/60 px-6 py-3 text-white rounded-xl font-medium flex items-center gap-2"
                                >
                                    <Play size={18} />
                                    Go Live
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}

            {/* Schedule Modal with enhanced design */}
            {showScheduleModal && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 backdrop-blur-lg bg-indigo-900/20 flex items-center justify-center z-50 p-4"
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="bg-white/95 backdrop-blur-xl border border-white/30 shadow-2xl shadow-indigo-200/30 w-full max-w-md rounded-3xl overflow-hidden"
                    >
                        <div className="bg-gradient-to-br from-indigo-500/5 to-violet-500/10 border-b border-indigo-100 p-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                                    <Calendar size={16} className="text-white" />
                                </div>
                                <h2 className="text-2xl font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                                    Schedule New Lecture
                                </h2>
                            </div>
                            <p className="text-gray-600 ml-11">Plan your next teaching session</p>
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
                                    className="bg-white border border-indigo-100 transition-all duration-300 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 focus:outline-none w-full p-3 rounded-xl text-gray-800"
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
                                    className="bg-white border border-indigo-100 transition-all duration-300 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 focus:outline-none w-full p-3 rounded-xl text-gray-800"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Duration
                                </label>
                                <select
                                    value={formData.duration}
                                    onChange={(e) => setFormData({...formData, duration: Number(e.target.value)})}
                                    className="bg-white border border-indigo-100 transition-all duration-300 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100 focus:outline-none w-full p-3 rounded-xl text-gray-800"
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
                                    className="bg-gradient-to-br from-indigo-400 to-indigo-600 transition-all duration-300 shadow-[0_4px_15px_rgba(79,70,229,0.3)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(79,70,229,0.4)] px-6 py-2 text-white rounded-lg font-medium"
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