import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, Video, Calendar, User, BookOpen, GraduationCap, Trophy, Award, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardCard from '../../components/misc/DashboardCard';
import { useUser } from '../../context/UserContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StudentDashboard = () => {
    const { user } = useUser();
    const [lectures, setLectures] = useState([]);
    const [mentor, setMentor] = useState(null);
    const [messages, setMessages] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [activeTab, setActiveTab] = useState('upcoming');
    const [progress, setProgress] = useState({
        totalHours: 0,
        completedLectures: 0,
        attendanceRate: 0,
        lastActivity: null
    });
    const [liveLectures, setLiveLectures] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const NODE_API = import.meta.env.VITE_NODE_API;
    
    const pastLectures = lectures.filter(l => l.status === 'completed');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInitialData = async () => {
            setIsLoading(true);
            await Promise.all([fetchLectures(), fetchMentorInfo()]);
            setIsLoading(false);
        };
        
        fetchInitialData();
    }, []);

    const fetchLectures = async () => {
        try {
            const [lecturesRes, liveRes] = await Promise.all([
                axios.get(`${NODE_API}/lectures/mentee`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }),
                axios.get(`${NODE_API}/lectures/live`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                })
            ]);
            
            setLiveLectures(liveRes.data);
            setLectures(lecturesRes.data);
        } catch (error) {
            console.error('Error fetching lectures:', error);
            toast.error('Failed to load lecture data');
        }
    };

    const fetchMentorInfo = async () => {
        try {
            const response = await axios.get(`${NODE_API}/users/mentee/mentor`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setMentor(response.data);
        } catch (error) {
            console.error('Error fetching mentor info:', error);
            toast.error('Failed to load mentor information');
        }
    };

    const joinLecture = (lecture) => {
        navigate(`/consultation-room/${lecture.roomId}`);
    };

    const upcomingLecture = lectures.find(l => l.status === 'scheduled');
    const totalHours = lectures.reduce((acc, lecture) => acc + (lecture.duration / 60), 0).toFixed(1);
    const completionRate = Math.round((lectures.filter(l => l.status === 'completed').length / (lectures.length || 1)) * 100);

    const stats = [
        {
            icon: <Clock className="text-indigo-500" />,
            label: "Next Lecture",
            value: upcomingLecture ? format(new Date(upcomingLecture.startTime), "MMM d, h:mm a") : "No upcoming lectures"
        },
        {
            icon: <Video className="text-violet-500" />,
            label: "Total Lectures",
            value: lectures.length
        },
        {
            icon: <BookOpen className="text-emerald-500" />,
            label: "Completed",
            value: lectures.filter(l => l.status === 'completed').length
        },
        {
            icon: <GraduationCap className="text-amber-500" />,
            label: "Hours Learned",
            value: `${totalHours} hrs`
        }
    ];

    const LoadingSkeleton = () => (
        <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
                ))}
            </div>
            <div className="h-64 bg-gray-200 rounded-xl mb-8"></div>
        </div>
    );
    
    if (isLoading) return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
            <div className="max-w-7xl mx-auto">
                <LoadingSkeleton />
            </div>
        </div>
    );
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 student-dashboard overflow-hidden">
            <div className="w-full px-6 py-8">
                <div className="max-w-7xl mx-auto">
                    {/* Enhanced Header */}
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6"
                    >
                        <div className="backdrop-blur-md bg-white/70 shadow-sm border border-gray-100 p-8 rounded-2xl w-full md:w-auto">
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                Welcome back, {user?.name}
                            </h1>
                            <p className="text-gray-600 mt-2">
                                Your learning journey continues here
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            {mentor && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="backdrop-blur-md bg-white/70 shadow-sm border border-gray-100 p-6 rounded-2xl flex items-center gap-4"
                                >
                                    <div className="relative">
                                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                                            {mentor.user.name.charAt(0)}
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                                            <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75"></span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium">Your Mentor</p>
                                        <h3 className="font-semibold text-gray-800 text-lg">{mentor.user.name}</h3>
                                        <span className="inline-block px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full mt-1 font-medium">
                                            Available Now
                                        </span>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                                className="backdrop-blur-md bg-white/70 shadow-sm border border-gray-100 p-6 rounded-2xl transition-all duration-300"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-white shadow-inner">
                                        {stat.icon}
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                                        <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Live Lectures & Progress Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                        {/* Live Lectures */}
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="lg:col-span-2"
                        >
                            <div className="backdrop-blur-md bg-white/70 shadow-sm border border-gray-100 p-8 rounded-2xl h-full">
                                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                    <Video className="text-red-500" size={24} />
                                    <span className="bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                                        Live Sessions
                                    </span>
                                </h2>
                                <div className="space-y-4">
                                    <AnimatePresence>
                                        {liveLectures.map(lecture => (
                                            <motion.div
                                                key={lecture.lectureId}
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                whileHover={{ scale: 1.02 }}
                                                className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-100 p-6 rounded-xl relative overflow-hidden shadow-sm"
                                            >
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-red-400 opacity-10 rounded-full -mr-10 -mt-10" />
                                                <div className="absolute bottom-0 left-0 w-24 h-24 bg-pink-400 opacity-10 rounded-full -ml-10 -mb-10" />
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <h3 className="font-semibold text-lg text-gray-800">{lecture.title}</h3>
                                                        <div className="flex items-center gap-3 mt-2">
                                                            <span className="flex items-center gap-2">
                                                                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                                                <span className="text-red-600 text-sm font-medium">Live Now</span>
                                                            </span>
                                                            <span className="h-4 w-px bg-gray-300"></span>
                                                            <span className="text-gray-500 text-sm">Join now to participate</span>
                                                        </div>
                                                    </div>
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => joinLecture(lecture)}
                                                        className="px-6 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:shadow-lg transition-all font-medium flex items-center gap-2"
                                                    >
                                                        Join Now
                                                        <ArrowRight size={16} />
                                                    </motion.button>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                    {liveLectures.length === 0 && (
                                        <motion.div 
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="text-center py-12 text-gray-400 bg-gray-50 rounded-xl"
                                        >
                                            <Video size={48} className="mx-auto mb-4 opacity-50" />
                                            <p className="text-lg font-medium">No live sessions at the moment</p>
                                            <p className="text-sm mt-2">Check your schedule for upcoming lectures</p>
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        </motion.div>

                        {/* Progress Card */}
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="lg:col-span-1"
                        >
                            <div className="backdrop-blur-md bg-white/70 shadow-sm border border-gray-100 p-8 rounded-2xl h-full">
                                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                    <Trophy className="text-amber-500" size={24} />
                                    <span className="bg-gradient-to-r from-amber-500 to-yellow-500 bg-clip-text text-transparent">
                                        Your Progress
                                    </span>
                                </h2>
                                <div className="space-y-8">
                                    <div className="p-6 rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-purple-50">
                                        <div className="flex justify-between items-center mb-2">
                                            <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                                            <div className="flex items-center gap-1">
                                                <Award size={16} className="text-amber-500" />
                                                <span className="text-sm font-medium text-amber-500">
                                                    {completionRate >= 75 ? 'Advanced' : 
                                                     completionRate >= 50 ? 'Intermediate' : 'Beginner'}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                            {completionRate}%
                                        </p>
                                        <div className="w-full h-3 bg-gray-200 rounded-full mt-4 overflow-hidden">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${completionRate}%` }}
                                                transition={{ delay: 0.6, duration: 1.5, ease: "easeOut" }}
                                                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="p-6 rounded-xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50">
                                        <p className="text-sm font-medium text-gray-600 mb-2">Learning Streak</p>
                                        <div className="flex items-center gap-3">
                                            <p className="text-3xl font-bold text-emerald-600">7</p>
                                            <p className="text-sm text-gray-500">Days in a row</p>
                                        </div>
                                        <div className="flex gap-1 mt-4">
                                            {[1, 2, 3, 4, 5, 6, 7].map(day => (
                                                <div 
                                                    key={day} 
                                                    className={`h-2 flex-1 rounded-full ${day <= 7 ? 'bg-emerald-500' : 'bg-gray-200'}`}
                                                ></div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Upcoming and Past Lectures */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Upcoming Lectures */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <div className="backdrop-blur-md bg-white/70 shadow-sm border border-gray-100 p-8 rounded-2xl">
                                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                    <Calendar size={24} className="text-indigo-500" />
                                    <span className="bg-gradient-to-r from-indigo-500 to-blue-500 bg-clip-text text-transparent">
                                        Upcoming Sessions
                                    </span>
                                </h2>
                                <div className="space-y-4">
                                    {lectures
                                        .filter(l => l.status === 'scheduled')
                                        .map((lecture, index) => (
                                            <motion.div 
                                                key={lecture._id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.1 * index }}
                                                whileHover={{ y: -3, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                                                className="border border-indigo-100 rounded-xl p-5 hover:bg-indigo-50/50 transition-all"
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="font-semibold text-gray-800">{lecture.title}</h3>
                                                        <div className="flex items-center gap-3 mt-2">
                                                            <span className="flex items-center gap-1 text-gray-500 text-sm">
                                                                <Calendar size={14} />
                                                                {format(new Date(lecture.startTime), "MMM d, yyyy")}
                                                            </span>
                                                            <span className="h-3 w-px bg-gray-300"></span>
                                                            <span className="flex items-center gap-1 text-gray-500 text-sm">
                                                                <Clock size={14} />
                                                                {format(new Date(lecture.startTime), "h:mm a")}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-gray-500 mt-2">
                                                            Duration: {lecture.duration} minutes
                                                        </p>
                                                    </div>
                                                    {new Date(lecture.startTime) <= new Date() && (
                                                        <motion.button
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                            onClick={() => joinLecture(lecture)}
                                                            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all font-medium"
                                                        >
                                                            Join
                                                        </motion.button>
                                                    )}
                                                </div>
                                            </motion.div>
                                        ))}
                                    {lectures.filter(l => l.status === 'scheduled').length === 0 && (
                                        <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-xl">
                                            <Calendar size={40} className="mx-auto mb-2 opacity-50" />
                                            <p>No upcoming sessions scheduled</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>

                        {/* Past Lectures */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            <div className="backdrop-blur-md bg-white/70 shadow-sm border border-gray-100 p-8 rounded-2xl">
                                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                    <Video size={24} className="text-violet-500" />
                                    <span className="bg-gradient-to-r from-violet-500 to-purple-500 bg-clip-text text-transparent">
                                        Past Sessions
                                    </span>
                                </h2>
                                <div className="space-y-4">
                                    {lectures
                                        .filter(l => l.status === 'completed')
                                        .map((lecture, index) => (
                                            <motion.div 
                                                key={lecture._id} 
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.1 * index }}
                                                className="border border-violet-100 rounded-xl p-5 hover:bg-violet-50/50 transition-all"
                                            >
                                                <h3 className="font-semibold text-gray-800">{lecture.title}</h3>
                                                <div className="flex items-center gap-3 mt-2">
                                                    <span className="flex items-center gap-1 text-gray-500 text-sm">
                                                        <Calendar size={14} />
                                                        {format(new Date(lecture.startTime), "MMM d, yyyy")}
                                                    </span>
                                                    <span className="h-3 w-px bg-gray-300"></span>
                                                    <span className="flex items-center gap-1 text-gray-500 text-sm">
                                                        <Clock size={14} />
                                                        {format(new Date(lecture.startTime), "h:mm a")}
                                                    </span>
                                                </div>
                                                {lecture.recordingUrl && (
                                                    <a
                                                        href={lecture.recordingUrl}
                                                        className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 text-sm font-medium mt-3 transition-colors"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <Video size={14} />
                                                        View Recording
                                                    </a>
                                                )}
                                            </motion.div>
                                        ))}
                                    {lectures.filter(l => l.status === 'completed').length === 0 && (
                                        <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-xl">
                                            <Video size={40} className="mx-auto mb-2 opacity-50" />
                                            <p>No past sessions yet</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
            <ToastContainer position="bottom-right" />
        </div>
    );
};

export default StudentDashboard;