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
            className="border-2 rounded-xl p-5 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer bg-white hover:bg-gray-50 transform hover:-translate-y-2 space-y-4"
            onClick={onClick}
        >
            <div className="flex justify-between items-center">
                <h3 className="font-bold text-xl text-gray-800 flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                    {course.name}
                </h3>
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {course.level} Level
                </div>
            </div>

            <div className="mt-4">
                <div className="h-3 w-full bg-gray-200 rounded-full overflow-auto mb-2">
                    <div
                        className={`h-full ${getProgressColor()} transition-all`}
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
                <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        {course.completedChapters} / {course.totalChapters} Chapters
                    </p>
                    <p className="text-sm font-medium text-gray-700">
                        {Math.round(progress)}% Complete
                    </p>
                </div>
            </div>

            {/* Assign Mentees Section - Only for Mentors */}
            {user?.userType === "Mentor" && (
                <div 
                    className="relative"
                    onClick={(e) => e.stopPropagation()} // Prevents card click when interacting with dropdown
                >
                    <button 
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
                        onClick={() => setShowDropdown(!showDropdown)}
                    >
                        Assign
                        <ChevronDown className="w-4 h-4" />
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

