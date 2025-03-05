import React, { useEffect, useState } from 'react';
import CourseCard from '../../components/course/CourseCard';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

const MyCourses = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    
    useEffect(() => {
        if (!user?.token) return; // Skip fetch if no token
    
        const fetchCourses = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/courses/courselist', {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                });
    
                if (response.ok) {
                    const data = await response.json();
                    const formattedCourses = data.map(course => ({
                        id: course._id,
                        name: course.courseName,
                        topic: course.skills.join(', '),
                        level: course.level,
                        completedChapters: course.chapters.filter(ch => ch.isCompleted).length,
                        totalChapters: course.chapters.length
                    }));
                    setCourses(formattedCourses);
                } else {
                    console.error('Failed to fetch courses');
                }
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };
    
        fetchCourses();
    }, [user?.token]);

    return (
        <div className='flex min-h-lvh w-full'>
            <div className="p-6 space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">My Courses</h2>
                    <button 
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        onClick={() => navigate('/create-course')} // 🔥 Navigate to create course page
                    >
                        Create Course
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {courses.map(course => (
                        <CourseCard 
                            key={course.id} 
                            course={course} 
                            onClick={() => navigate(`/course/${course.id}`)} // 🔥 Navigate to course details page
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MyCourses;
