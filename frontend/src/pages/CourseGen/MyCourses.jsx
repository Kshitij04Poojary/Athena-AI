import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { PlusCircle, BookOpen } from 'lucide-react';
import CourseCard from '../../components/course/CourseCard';
import AssignedCourses from './AssignedCourses';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const MyCourses = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);
  const NODE_API = import.meta.env.VITE_NODE_API;

  // Track language changes to force re-render
  useEffect(() => {
    const handleLanguageChange = () => {
      setLanguage(i18n.language);
    };
    i18n.on('languageChanged', handleLanguageChange);
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  useEffect(() => {
    console.log('User state changed:', { user: user, hasToken: !!user?.token });
    
    const fetchCourses = async () => {
        // Get token from user object or localStorage as fallback
        const token = user?.token || localStorage.getItem('token') || localStorage.getItem('authToken');
        
        if (!token) {
          console.log('No token found in user object or localStorage');
          setIsLoading(false);
          return;
        }

        try {
            console.log('Fetching courses with token:', token.substring(0, 10) + '...');
            const response = await axios.get(`${NODE_API}/courses/courselist`, {
            headers: { Authorization: `Bearer ${token}` },
            });

            const data = response.data;
            const filteredCourses = data
            .map(course => ({
                id: course._id,
                name: course.courseName,
                skills: course.skills,
                level: course.level,
                completedChapters: course.chapters.filter(ch => ch.isCompleted).length,
                totalChapters: course.chapters.length,
                assignedCopy: course.assignedCopy,
            }))
            .filter(course => !course.assignedCopy);
            setCourses(filteredCourses);
            console.log('Courses fetched successfully:', filteredCourses.length);
        } catch (error) {
            console.error(t('error.fetchCourses'), error);
            setCourses([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Only fetch if user exists (regardless of token since we'll use localStorage fallback)
    if (user) {
      console.log('User available, attempting to fetch courses...');
      fetchCourses();
    } else {
      console.log('User still undefined, keeping loading state');
    }
    
  }, [user, t, language, NODE_API]);

  // Delete course function
  const handleDeleteCourse = async (courseId) => {
    try {
        // Get token from user object or localStorage as fallback
        const token = user?.token || localStorage.getItem('token') || localStorage.getItem('authToken');
        
        await axios.delete(`${NODE_API}/courses/${courseId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        });

        setCourses(prevCourses => prevCourses.filter(course => course.id !== courseId));
    } catch (error) {
        console.error('Error deleting course:', error);
        throw error;
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-white mt-[45px]">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
          {/* Header Section */}
          <div className="p-8 bg-gradient-to-r from-blue-600 to-blue-700">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <BookOpen className="w-8 h-8" />
                {t('myCourses.title')}
              </h1>
              <button
                className="flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-md backdrop-blur-sm border border-white/20"
                onClick={() => navigate('/create-course')}
              >
                <PlusCircle className="w-5 h-5" />
                {t('myCourses.createCourse')}
              </button>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
              </div>
            ) : courses.length === 0 ? (
              <div className="text-center py-12">
                <div className="max-w-md mx-auto">
                  <h2 className="text-xl font-medium text-blue-700 mb-4">{t('myCourses.noCourses')}</h2>
                  <p className="text-gray-600">{t('myCourses.startJourney')}</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map(course => (
                  <div
                    key={course.id}
                    className="transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <CourseCard
                      course={course}
                      onClick={() => navigate(`/course/${course.id}`)}
                      onDelete={handleDeleteCourse}
                      className="cursor-pointer h-full shadow-sm hover:shadow-md transition-all duration-300"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Assigned Courses Section */}
        {user?.userType === 'Mentor' && (
          <div className="mt-8">
            <AssignedCourses />
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourses;