import React from 'react';
import CourseCard from '../../components/course/CourseCard';
import SideBar from '../../components/SideBar'
import { useUser } from '../../context/UserContext';

const dummyCourses = [
    { id: 1, name: 'Web Development Bootcamp', topic: 'Full Stack', level: 'Beginner', completedChapters: 2, totalChapters: 5 },
    { id: 2, name: 'Data Science Mastery', topic: 'Machine Learning', level: 'Intermediate', completedChapters: 4, totalChapters: 5 },
    { id: 3, name: 'Cloud Computing Essentials', topic: 'AWS', level: 'Advanced', completedChapters: 2, totalChapters: 3 }
];

const MyCourses = () => {
    const { user } = useUser();
    return (
        <div className='flex min-h-lvh w-full'>
        <SideBar/>
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">My Courses</h2>
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Create Course
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dummyCourses.map(course => (
                    <CourseCard key={course.id} course={course} />
                ))}
            </div>
        </div>
        </div>
    );
};

export default MyCourses;
