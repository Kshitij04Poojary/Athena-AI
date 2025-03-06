import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Auth/Register';
import Login from './pages/Auth/Login';
import Home from './pages/Home';
import StudentDashboard from './pages/VideoConferencing/StudentDashboard';
import ConsultationRoom from './pages/VideoConferencing/ConsultationRoom';
import TeacherDashboard from './pages/VideoConferencing/TeacherDashboard';
import { UserProvider } from './context/UserContext';
// import { SocketProvider } from './context/SocketContext';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import CreateCourse from './pages/CourseGen/CreateCourse';
import CourseDetails from './pages/CourseGen/CourseDetails';
import MyCourses from './pages/CourseGen/MyCourses';
import ExamDashboard from './pages/Assessment/ExamDashboard';
import Exam from './pages/Assessment/Exam';
import ExamReview from './pages/Assessment/ExamReview';
import MainLayout from './MainLayout';
import ChapterDetails from './pages/CourseGen/ChapterDetails';
import StartInterview from './pages/Interview/StartInterview';
import MainInterview from './pages/Interview/MainInterview'
import Feedback from './pages/Interview/Feedback';
import InterviewDashboard from './pages/Interview/InterviewDashboard';
import ProfilePage from './pages/Auth/ProfilePage'; 

const App = () => (
    <UserProvider>
            <Router>
                <ToastContainer />
                <Routes>
                    <Route path="/" element={<Navigate to="/register" />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/home" element={<Home />} />
                    
                    if(useUser().user.role==='mentee'){   
                        <Route path="/mentee" element={<StudentDashboard />} />
                    }
                    if(useUser().user.role==='mentor'){
                        <Route path="/mentor" element={<TeacherDashboard />} />
                    }
                    
                    <Route path="/consultation-room/:roomId" element={<ConsultationRoom />} />
                    
                <Route element={<MainLayout />}>

                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/my-courses" element={<MyCourses />} />
                    <Route path="/create-course" element={<CreateCourse />} />
                    <Route path="/course/:courseId" element={<CourseDetails />} />
                    <Route path="/course/:courseId/chapter/:chapterId" element={<ChapterDetails />} />
                    <Route path="/assessment" element={<ExamDashboard />} />
                    <Route path="/interview" element={<InterviewDashboard/>} />
                    <Route path='/interview/:interviewId/feedback' element={<Feedback/>}/>
                    
                </Route>
                
                <Route path="/interview/:interviewId" element={<StartInterview/>}/>
                <Route path='/interview/:interviewId/start' element={<MainInterview/>}/>          
                <Route path="/assessment/:examId" element={<Exam />} />
                <Route path="/examreview" element={<ExamReview />} />
            </Routes>
            </Router>
    </UserProvider>
);

export default App;
