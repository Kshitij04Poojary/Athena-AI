import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, Video,Calendar, User, BookOpen, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
// import { motion } from 'framer-motion';
import DashboardCard from '../../components/DashboardCard';
import { useUser } from '../../context/UserContext';
// import { useSocket } from '../../context/SocketContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./StudentDashboard.css";

const StudentDashboard = () => {
    const { user } = useUser();
    console.log(user);
    // const  socket  = useSocket();
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
    // const liveLectures = lectures.filter(l => l.status === 'ongoing');
const pastLectures = lectures.filter(l => l.status === 'completed');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInitialData = async () => {
          await fetchLectures();
          await fetchMentorInfo();
          
          // Fetch initial live lectures
        //   try {
        //     const [lecturesRes, liveRes] = await Promise.all([
        //       axios.get('/api/lectures/mentee'),
        //       axios.get('/api/lectures/live')
        //     ]);
        //     setLectures(lecturesRes.data);
        //     setLiveLectures(liveRes.data);
        //   } catch (error) {
        //     console.error('Error fetching data:', error);
        //   }
        };
        
        fetchInitialData();
      }, []);

      
    

    const fetchLectures = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/lectures/mentee',{
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            const liveres=await axios.get('http://localhost:8000/api/lectures/live',{
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

    const joinLecture = (lecture) => {
        navigate(`/consultation-room/${lecture.roomId}`);
    };

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

    const LiveLecturesSection = () => (
        <DashboardCard className="p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Video size={24} className="text-red-600" />
            Live Lectures
        </h2>
        <div className="space-y-4">
            {liveLectures.map(lecture => (
                <div 
                    key={lecture.lectureId} 
                    className={`live-lecture-card ${liveLectures.length > 0 ? 'active' : ''}`}
                >
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="font-semibold">{lecture.title}</h3>
                            <p className="text-sm text-red-600">Live Now!</p>
                        </div>
                        <button
                            onClick={() => joinLecture(lecture)}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Join Now
                        </button>
                    </div>
                </div>
            ))}
            {liveLectures.length === 0 && (
                <p className="text-gray-500 text-center">No live lectures at the moment</p>
            )}
        </div>
    </DashboardCard>
);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
             <ToastContainer />
             <div className="container mx-auto px-4 py-8">
                {/* Welcome Banner */}
                <div className="welcome-banner mb-8">
      <h1 className="text-4xl  font-bold mb-2">{user?.name}</h1>
      <p className="text-lg">Track your learning progress</p>
    </div>
                <div className="max-w-7xl mx-auto">
                    {/* Header with Mentor Info */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-gray-400 mb-2">Welcome Back!</h1>
                        {/* <p className="text-gray-600">Track your learning progress and upcoming lectures</p> */}
                    </div>

                    {/* Mentor Card */}
                    {mentor && (
                        <DashboardCard className="p-6 mb-8">
                            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                <User size={24} className="text-blue-600" />
                                Your Mentor
                            </h2>
                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                    {mentor.user.name}
                                </div>
                                <div>
                                    <h3 className="text-2xl font-semibold text-gray-800">{mentor.user.name}</h3>
                                    <p className="text-gray-600">{mentor.user.email}</p>
                                    <div className="mt-2 flex gap-2">
                                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                                            Expert Mentor
                                        </span>
                                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                                            Available
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </DashboardCard>
                    )}

                    <div className="space-y-8">
                       
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                        {stats.map((stat, index) => (
                            <DashboardCard key={index} className="p-5 hover:bg-opacity-90">
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
                        <LiveLecturesSection />

                        {/* Progress Overview */}
                        <DashboardCard className="p-6">
                            <h2 className="text-xl font-semibold mb-4">Learning Progress</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-blue-50 rounded-lg">
                                    <p className="text-sm text-blue-600">Attendance Rate</p>
                                    <p className="text-2xl font-bold text-blue-700">
                                        {progress.attendanceRate}%
                                    </p>
                                </div>
                                {/* Add more progress metrics */}
                            </div>
                        </DashboardCard>

                        {/* Tabs for different views */}
                      
    
                            {/* Tab Content */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
                                {/* Upcoming Lectures */}
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
            </div>
        
    );
};

export default StudentDashboard;
