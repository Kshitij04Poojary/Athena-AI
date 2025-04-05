import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-indigo-100 flex flex-col items-center justify-center p-4 md:p-6">
      {/* Navbar */}
      <nav className="w-full max-w-7xl absolute top-0 flex justify-between items-center p-4 bg-white bg-opacity-80 backdrop-blur-sm rounded-lg mt-3 shadow-md">
        <div className="text-xl md:text-2xl font-bold text-indigo-900">AthenaAI</div>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="p-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-4">
          <Link
            to="/login"
            className="px-4 py-2 text-indigo-900 hover:bg-indigo-50 rounded-lg transition duration-300"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300"
          >
            Get Started
          </Link>
        </div>
      </nav>
      
      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden w-full max-w-7xl absolute top-16 bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-lg z-50 animate-fadeIn">
          <div className="flex flex-col p-4">
            <Link
              to="/login"
              className="px-4 py-3 text-indigo-900 hover:bg-indigo-50 rounded-lg transition duration-300 text-center"
              onClick={() => setMenuOpen(false)}
            >
              Login
            </Link>
            <Link
              to="/register"
              className="mt-2 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300 text-center"
              onClick={() => setMenuOpen(false)}
            >
              Get Started
            </Link>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="text-center max-w-4xl mt-24 animate-fadeIn px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-indigo-900 mb-6 leading-tight">
          Unlock Your Potential with Personalized Learning
        </h1>
        <p className="text-lg md:text-xl text-gray-700 mb-8">
          Join EduMentor to access expert mentorship, interactive courses, and real-world projects tailored to your goals.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link
            to="/register"
            className="px-6 py-3 md:px-8 md:py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300 text-lg font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Sign Up for Free
          </Link>
          <Link
            to="/login"
            className="px-6 py-3 md:px-8 md:py-4 border-2 border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition duration-300 text-lg font-medium shadow-md hover:shadow-lg transform hover:-translate-y-1"
          >
            Login
          </Link>
        </div>
      </div>

      {/* Stats Section */}
      <div className="mt-16 w-full max-w-6xl bg-white rounded-xl shadow-lg p-4 md:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="p-4">
            <p className="text-3xl md:text-4xl font-bold text-indigo-600">1000+</p>
            <p className="text-gray-600">Active Mentors</p>
          </div>
          <div className="p-4">
            <p className="text-3xl md:text-4xl font-bold text-indigo-600">50K+</p>
            <p className="text-gray-600">Students Enrolled</p>
          </div>
          <div className="p-4">
            <p className="text-3xl md:text-4xl font-bold text-indigo-600">200+</p>
            <p className="text-gray-600">Interactive Courses</p>
          </div>
        </div>
      </div>

      {/* Main Features Section */}
      <div className="mt-16 w-full max-w-7xl px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-indigo-900 text-center mb-8">
          Your Complete Learning Ecosystem
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 border-t-4 border-indigo-500">
            <h3 className="text-xl font-semibold text-indigo-900 mb-4">Expert Mentorship</h3>
            <p className="text-gray-600">
              Connect with experienced mentors who guide you through your learning journey with personalized feedback.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 border-t-4 border-indigo-500">
            <h3 className="text-xl font-semibold text-indigo-900 mb-4">Interactive Courses</h3>
            <p className="text-gray-600">
              Access hands-on courses designed to help you master new skills with practical exercises.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 border-t-4 border-indigo-500">
            <h3 className="text-xl font-semibold text-indigo-900 mb-4">Real-World Projects</h3>
            <p className="text-gray-600">
              Work on projects that simulate real-world challenges and build your portfolio to showcase to employers.
            </p>
          </div>
        </div>
      </div>

      {/* Additional Features */}
      <div className="mt-16 w-full max-w-7xl px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-indigo-900 text-center mb-8">
          Comprehensive Learning Tools
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="bg-indigo-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto md:mx-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-xl font-semibold text-indigo-900">Skill Assessments</h3>
              <p className="text-gray-600">Test your knowledge with comprehensive exams and get instant feedback.</p>
              <Link to="/assessment" className="text-indigo-600 hover:text-indigo-800 mt-2 inline-block">Learn more →</Link>
            </div>
          </div>
          
          <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="bg-indigo-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto md:mx-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-xl font-semibold text-indigo-900">Mock Interviews</h3>
              <p className="text-gray-600">Practice interview skills with AI-powered mock interviews and detailed feedback.</p>
              <Link to="/interview" className="text-indigo-600 hover:text-indigo-800 mt-2 inline-block">Learn more →</Link>
            </div>
          </div>
          
          <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="bg-indigo-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto md:mx-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-xl font-semibold text-indigo-900">Smart Scheduling</h3>
              <p className="text-gray-600">Easily schedule consultation sessions with mentors using our calendar system.</p>
              <Link to="/calendar" className="text-indigo-600 hover:text-indigo-800 mt-2 inline-block">Learn more →</Link>
            </div>
          </div>
          
          <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="bg-indigo-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto md:mx-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-xl font-semibold text-indigo-900">Internship Opportunities</h3>
              <p className="text-gray-600">Discover and apply for internships aligned with your skills and career goals.</p>
              <Link to="/internships" className="text-indigo-600 hover:text-indigo-800 mt-2 inline-block">Learn more →</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Role-based Features */}
      <div className="mt-16 w-full max-w-7xl px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-indigo-900 text-center mb-8">
          Tailored For Your Role
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 md:p-8 rounded-xl shadow-lg hover:shadow-xl transition duration-300 border border-indigo-100">
            <h3 className="text-xl md:text-2xl font-semibold text-indigo-900 mb-4">For Students</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <svg className="h-6 w-6 text-indigo-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Personalized learning dashboard</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-indigo-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>AI project recommendations based on your skills</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-indigo-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Book one-on-one consultations with mentors</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-indigo-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Track your progress across all courses</span>
              </li>
            </ul>
            <Link to="/register" className="mt-6 w-full sm:w-auto inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300 text-center">
              Join as a Student
            </Link>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 md:p-8 rounded-xl shadow-lg hover:shadow-xl transition duration-300 border border-blue-100">
            <h3 className="text-xl md:text-2xl font-semibold text-blue-900 mb-4">For Mentors</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <svg className="h-6 w-6 text-blue-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Create and publish your own courses</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-blue-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Schedule and manage consultation sessions</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-blue-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Create assessments and monitor student progress</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-blue-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Earn while sharing your expertise</span>
              </li>
            </ul>
            <Link to="/register" className="mt-6 w-full sm:w-auto inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 text-center">
              Join as a Mentor
            </Link>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-16 w-full max-w-4xl bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg p-6 md:p-10 text-center text-white">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Transform Your Learning Journey?</h2>
        <p className="text-lg md:text-xl mb-6">Join thousands of students and mentors already on the platform.</p>
        <Link
          to="/register"
          className="w-full sm:w-auto inline-block px-6 py-3 md:px-8 md:py-4 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition duration-300 text-lg font-medium shadow-lg"
        >
          Get Started For Free
        </Link>
      </div>

      {/* Footer */}
      <footer className="mt-16 md:mt-20 w-full max-w-7xl text-center text-gray-600 border-t border-gray-200 pt-6 px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-6 text-left">
          <div>
            <h4 className="font-bold mb-3 md:mb-4">Platform</h4>
            <ul className="space-y-2">
              <li><Link to="/my-courses" className="hover:text-indigo-600">Courses</Link></li>
              <li><Link to="/assessment" className="hover:text-indigo-600">Assessments</Link></li>
              <li><Link to="/interview" className="hover:text-indigo-600">Interviews</Link></li>
              <li><Link to="/internships" className="hover:text-indigo-600">Internships</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-3 md:mb-4">Company</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-indigo-600">About Us</a></li>
              <li><a href="#" className="hover:text-indigo-600">Careers</a></li>
              <li><a href="#" className="hover:text-indigo-600">Blog</a></li>
              <li><a href="#" className="hover:text-indigo-600">Press</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-3 md:mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-indigo-600">Help Center</a></li>
              <li><a href="#" className="hover:text-indigo-600">Community</a></li>
              <li><a href="#" className="hover:text-indigo-600">Webinars</a></li>
              <li><a href="#" className="hover:text-indigo-600">Events</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-3 md:mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-indigo-600">Terms of Service</a></li>
              <li><a href="#" className="hover:text-indigo-600">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-indigo-600">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        <p className="py-4">© 2023 EduMentor. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;