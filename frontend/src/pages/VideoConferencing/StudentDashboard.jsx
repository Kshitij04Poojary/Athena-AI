import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, Video, Calendar, User, BookOpen, GraduationCap, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import DashboardCard from '../../components/DashboardCard';
import { useUser } from '../../context/UserContext';
import MenteeProfileForm from '../../components/MenteeProfileForm';
import MenteeProfileView from '../../components/MenteeProfileView';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./Style.css";

const StudentDashboard = () => {
    const { user } = useUser();
    console.log(user);
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
    const [showProfileForm, setShowProfileForm] = useState(false);
    const [profileData, setProfileData] = useState(null);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [isViewingProfile, setIsViewingProfile] = useState(false);
    const pastLectures = lectures.filter(l => l.status === 'completed');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInitialData = async () => {
            await fetchLectures();
            await fetchMentorInfo();
        };
        
        fetchInitialData();
    }, []);

    useEffect(() => {
        fetchProfileData();
    }, []);

    const fetchLectures = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/lectures/mentee',{
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            const liveres = await axios.get('http://localhost:8000/api/lectures/live',{
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setLiveLectures(liveres.data);
            setLectures(response.data);
        } catch (error) {
            console.error('Error fetching lectures:', error);
        }
    };

    const fetchMentorInfo = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/users/mentee/mentor',{
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setMentor(response.data);
        } catch (error) {
            console.error('Error fetching mentor info:', error);
        }
    };

    const fetchProfileData = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/mentee/profile', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setProfileData(response.data);
            setShowProfileForm(response.data.profileCompleted);
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const joinLecture = (lecture) => {
        navigate(`/consultation-room/${lecture.roomId}`);
    };

    const handleProfileEdit = () => {
        setIsEditingProfile(true);
        setIsViewingProfile(false);
    };

    const handleProfileUpdate = async (updatedData) => {
        try {
            const response = await axios.put(
                'http://localhost:8000/api/mentee/profile',
                updatedData,
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                }
            );
            setProfileData(response.data);
            setIsEditingProfile(false);
            toast.success('Profile updated successfully!');
        } catch (error) {
            toast.error('Failed to update profile');
        }
    };

    const renderProfileButton = () => (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsViewingProfile(true)}
            className="glass-card px-4 py-2 rounded-lg flex items-center gap-2 text-blue-600"
        >
            <User size={18} />
            View Profile
        </motion.button>
    );

    const upcomingLecture = lectures.find(l => l.status === 'scheduled');
    const totalHours = lectures.reduce((acc, lecture) => acc + (lecture.duration / 60), 0).toFixed(1);

    const stats = [
        {
            icon: <Clock className="text-blue-500" />,
            label: "Next Lecture",
            value: upcomingLecture ? format(new Date(upcomingLecture.startTime), "MMM d, h:mm a") : "No upcoming lectures"
        },
        {
            icon: <Video className="text-purple-500" />,
            label: "Total Lectures",
            value: lectures.length
        },
        {
            icon: <BookOpen className="text-green-500" />,
            label: "Completed",
            value: lectures.filter(l => l.status === 'completed').length
        },
        {
            icon: <GraduationCap className="text-yellow-500" />,
            label: "Hours Learned",
            value: `${totalHours} hrs`
        }
    ];

    if (isViewingProfile) {
        return <MenteeProfileView 
            profile={profileData} 
            onEdit={handleProfileEdit}
            onBack={() => setIsViewingProfile(false)}
        />;
    }

    if (isEditingProfile) {
        return <MenteeProfileForm 
            initialData={profileData}
            onComplete={(updatedData) => {
                handleProfileUpdate(updatedData);
                setIsViewingProfile(true);
            }}
        />;
    }

    if (showProfileForm) {
        return (
            <div className="min-h-screen student-dashboard">
                <div className="container mx-auto py-8">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Complete Your Profile
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Let's get to know you better to enhance your learning journey
                        </p>
                    </div>
                    <MenteeProfileForm 
                        initialData={profileData} 
                        onComplete={() => {
                            setShowProfileForm(false);
                            fetchProfileData();
                        }}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen student-dashboard">
            <div className="w-full px-6 py-8">
                <div className="max-w-7xl mx-auto">
                    {/* Enhanced Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                        <div className="glass-card p-6 rounded-2xl w-full md:w-auto">
                            <h1 className="text-4xl font-bold bg-blue-600 bg-clip-text text-transparent">
                                Welcome back, {user?.name}
                            </h1>
                            <p className="text-gray-600 mt-2">
                                Your learning journey continues here
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            
                            {mentor && (
                                <div className="glass-card p-4 rounded-xl flex items-center gap-4">
                                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                                        {mentor.user.name}
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Your Mentor</p>
                                        <h3 className="font-semibold text-gray-800">{mentor.user.name}</h3>
                                        <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full mt-1">
                                            Available
                                        </span>
                                    </div>
                                </div>
                                
                            )}
                            {renderProfileButton()}
                        </div>
                    </div>

                    {/* Stats Grid */}
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
                                    <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-white">
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

                    {/* Live Lectures Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                        {/* Live Lectures */}
                        <div className="lg:col-span-2">
                            <DashboardCard className="p-6">
                                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                    <Video className="text-red-600" size={24} />
                                    <span className="bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                                        Live Sessions
                                    </span>
                                </h2>
                                <div className="space-y-4">
                                    {liveLectures.map(lecture => (
                                        <motion.div
                                            key={lecture.lectureId}
                                            className="live-lecture-card glass-card p-6 rounded-xl relative overflow-hidden"
                                            whileHover={{ scale: 1.02 }}
                                        >
                                            <div className="absolute top-0 right-0 w-24 h-24 bg-red-500 opacity-10 rounded-full -mr-6 -mt-6" />
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <h3 className="font-semibold text-lg">{lecture.title}</h3>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <span className="flex items-center gap-1">
                                                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                                            <span className="text-red-600 text-sm">Live Now</span>
                                                        </span>
                                                    </div>
                                                </div>
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => joinLecture(lecture)}
                                                    className="px-6 py-2 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all"
                                                >
                                                    Join Now
                                                </motion.button>
                                            </div>
                                        </motion.div>
                                    ))}
                                    {liveLectures.length === 0 && (
                                        <div className="text-center py-8 text-gray-500">
                                            <Video size={40} className="mx-auto mb-2 opacity-50" />
                                            No live sessions at the moment
                                        </div>
                                    )}
                                </div>
                            </DashboardCard>
                        </div>

                        {/* Progress Card */}
                        <div className="lg:col-span-1">
                            <DashboardCard className="p-6">
                                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                    <Trophy className="text-yellow-600" size={24} />
                                    Your Progress
                                </h2>
                                <div className="space-y-4">
                                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
                                        <p className="text-sm text-gray-600">Completion Rate</p>
                                        <p className="text-3xl font-bold text-blue-600">
                                            {Math.round((lectures.filter(l => l.status === 'completed').length / lectures.length) * 100) || 0}%
                                        </p>
                                        <div className="w-full h-2 bg-gray-200 rounded-full mt-2">
                                            <div 
                                                className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
                                                style={{ 
                                                    width: `${(lectures.filter(l => l.status === 'completed').length / lectures.length) * 100}%` 
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </DashboardCard>
                        </div>
                    </div>

                    {/* Upcoming and Past Lectures */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Upcoming Lectures */}
                        <DashboardCard className="p-6 mt-6">
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-blue-600">
                                <Calendar size={24} />
                                Upcoming Sessions
                            </h2>
                            <div className="space-y-4">
                                {lectures
                                    .filter(l => l.status === 'scheduled')
                                    .map(lecture => (
                                        <div key={lecture._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-semibold">{lecture.title}</h3>
                                                    <p className="text-sm text-gray-600">
                                                        {format(new Date(lecture.startTime), "MMM d, yyyy 'at' h:mm a")}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        Duration: {lecture.duration} minutes
                                                    </p>
                                                </div>
                                                {new Date(lecture.startTime) <= new Date() && (
                                                    <button
                                                        onClick={() => joinLecture(lecture)}
                                                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                                                    >
                                                        Join
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </DashboardCard>

                        {/* Past Lectures */}
                        <DashboardCard className="p-6">
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <Video size={24} className="text-purple-600" />
                                Past Lectures
                            </h2>
                            <div className="space-y-4">
                                {lectures
                                    .filter(l => l.status === 'completed')
                                    .map(lecture => (
                                        <div key={lecture._id} className="border rounded-lg p-4">
                                            <h3 className="font-semibold">{lecture.title}</h3>
                                            <p className="text-sm text-gray-600">
                                                {format(new Date(lecture.startTime), "MMM d, yyyy 'at' h:mm a")}
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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
