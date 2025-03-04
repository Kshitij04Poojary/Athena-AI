import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Auth/Register';
import Login from './pages/Auth/Login';
import Home from './pages/Home';
import { UserProvider } from './context/UserContext';
import 'react-toastify/dist/ReactToastify.css';
import CreateCourse from './pages/CourseGen/createCourse';
import CreateCourseProxy from './pages/CourseGen/CreateCourseProxy';
import MyCourses from './pages/CourseGen/MyCourses';
import ExamDashboard from './pages/Assessment/ExamDashboard';
import Exam from './pages/Assessment/Exam';
import ExamReview from './pages/Assessment/ExamReview';

const App = () => (
    <UserProvider>
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/register" />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/home" element={<Home />} />
                <Route path="/my-courses" element={<MyCourses/>}/>
                <Route path="/create-course" element={<CreateCourseProxy/>}/>
                <Route path="/assessment" element={<ExamDashboard/>} />
                <Route path="/assessment/:examId" element={<Exam />} />
                <Route path="/examreview" element={<ExamReview />} />
            </Routes>
        </Router>
    </UserProvider>
);

export default App;
