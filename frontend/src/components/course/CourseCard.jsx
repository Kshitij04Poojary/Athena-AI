import React, { useEffect, useState } from 'react';
import { BookOpen, CheckCircle, ChevronDown } from 'lucide-react';
import AssignMentees from './AssignMentees';
import { useUser } from '../../context/UserContext';

const CourseCard = ({ course, onClick }) => {
    const { user } = useUser();
    const [showDropdown, setShowDropdown] = useState(false);

    const progress = course.totalChapters > 0
        ? (course.completedChapters / course.totalChapters) * 100
        : 0;

    const getProgressColor = () => {
        if (progress < 33) return 'bg-red-500';
        if (progress < 66) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    return (
        <div
            className="sm:h-[150px] md:h-[180px] border-1 rounded-xl p-3 md:p-5 flex flex-col justify-between shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer hover:bg-gray-50 transform"
            onClick={onClick}
        >
            <div className="flex justify-between items-start sm:items-center gap-2 sm:gap-0">
                <h3 className="font-bold lg:text-md md:text-xl text-gray-800 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                    {course.name.length > 20 ? `${course.name.substring(0, 20)}...` : course.name}
                </h3>
                <div className="bg-blue-100 text-blue-800 px-2 py-1 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-medium mt-1 sm:mt-0">
                    {course.level}
                </div>
            </div>

            <div className="max-sm:mt-3 flex flex-col justify-between sm:gap-2 md:gap-3">

                <div className="w-full flex flex-col max-sm:gap-1">
                    <div className='w-full bg-gray-100 rounded-full'>
                        <div
                            className={`h-2 md:h-3 ${getProgressColor()} overflow-auto rounded-full transition-all`}
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    <p className="text-xs md:text-sm sm:mt-2 md:mt-1.5 text-gray-500 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-green-500" />
                        {course.completedChapters} / {course.totalChapters} Chapters
                    </p>
                </div>

                <div className='max-sm:mt-3'>
                    <p className="text-xs md:text-sm font-medium text-gray-700">
                        {Math.round(progress)}% Complete
                    </p>
                </div>

            </div>

            {/* Assign Mentees Section - Only for Mentors */}
            {user?.userType === "Mentor" && (
                <div
                    className="relative mt-2 md:mt-0"
                    onClick={(e) => e.stopPropagation()} // Prevents card click when interacting with dropdown
                >
                    <button
                        className="bg-blue-600 text-white px-3 py-1 md:px-4 md:py-2 rounded-lg flex items-center gap-1 md:gap-2 hover:bg-blue-700 transition text-sm md:text-base"
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowDropdown(!showDropdown)
                        }}
                    >
                        Assign
                        <ChevronDown className="w-3 h-3 md:w-4 md:h-4" />
                    </button>

                    {showDropdown && (
                        <AssignMentees
                            courseId={course.id}
                            closeDropdown={() => setShowDropdown(false)}
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default CourseCard;

