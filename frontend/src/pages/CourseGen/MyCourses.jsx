import React, { useEffect, useState } from 'react';
import CourseCard from '../../components/course/CourseCard';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { PlusCircle, BookOpen } from 'lucide-react';
import AssignedCourses from './AssignedCourses';
import { useTranslation } from 'react-i18next';

const MyCourses = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { t, i18n } = useTranslation();
    const [language, setLanguage] = useState(i18n.language);

    // Track language changes to force component re-render
    useEffect(() => {
        const handleLanguageChange = () => {
            console.log("Language changed to:", i18n.language);
            setLanguage(i18n.language); // Trigger re-render when language changes
        };

        i18n.on('languageChanged', handleLanguageChange);

        return () => {
            i18n.off('languageChanged', handleLanguageChange);
        };
    }, []);

    useEffect(() => {
        console.log("Current Language in MyCourses:", i18n.language);

        if (!user?.token) {
            setIsLoading(false);
            return;
        }

        const fetchCourses = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/courses/courselist', {
                    headers: { Authorization: `Bearer ${user.token}` }
                });

                if (response.ok) {
                    const data = await response.json();
                    const filteredCourses = data
                        .map(course => ({
                            id: course._id,
                            name: course.courseName,
                            topic: course.skills.join(', '),
                            level: course.level,
                            completedChapters: course.chapters.filter(ch => ch.isCompleted).length,
                            totalChapters: course.chapters.length,
                            assignedCopy: course.assignedCopy
                        }))
                        .filter(course => !course.assignedCopy);

                    setCourses(filteredCourses);
                } else {
                    console.error(t('error.fetchCourses'));
                }
            } catch (error) {
                console.error(t('error.fetchCourses'), error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCourses();
    }, [user?.token, t, language]); // Now reacts to language changes

    return (
        <div className='bg-gray-50 min-h-screen w-full'>
            <div className="container mx-auto px-4 py-8">
                <div className="bg-white shadow-xl rounded-2xl overflow-visible">
                    <div className="p-6 bg-gradient-to-r from-blue-600 to-purple-600">
                        <div className="flex justify-between items-center">
                            <h2 className="text-3xl font-extrabold text-white flex items-center gap-3">
                                <BookOpen className="w-8 h-8" />
                                {t('myCourses.title')}
                            </h2>
                            <button 
                                className="flex items-center gap-2 bg-white text-blue-600 px-5 py-2.5 rounded-full font-semibold hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-md"
                                onClick={() => navigate('/create-course')}
                            >
                                <PlusCircle className="w-5 h-5" />
                                {t('myCourses.createCourse')}
                            </button>
                        </div>
                    </div>

                    <div className="p-6">
                        {isLoading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
                            </div>
                        ) : courses.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                <p className="text-xl mb-4">{t('myCourses.noCourses')}</p>
                                <p>{t('myCourses.startJourney')}</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {courses.map(course => (
                                    <div 
                                        key={course.id} 
                                        className="transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                                        onClick={() => navigate(`/course/${course.id}`)}
                                    >
                                        <CourseCard 
                                            course={course} 
                                            className="cursor-pointer"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {user?.userType == 'Mentor' && <AssignedCourses />}
            </div>
        </div>
    );
};

export default MyCourses;
