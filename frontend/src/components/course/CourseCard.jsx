import React, { useState } from 'react';
import { BookOpen, CheckCircle, ChevronDown, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import AssignMentees from './AssignMentees';
import { useUser } from '../../context/UserContext';
import skillIconMap from '../../data/skillIconMap';

const CourseCard = ({ course, onClick, onDelete }) => {
    const { user } = useUser();
    const [showDropdown, setShowDropdown] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const progress = course.totalChapters > 0
        ? (course.completedChapters / course.totalChapters) * 100
        : 0;

    const getProgressColor = () => {
        if (progress < 33) return 'bg-red-500';
        if (progress < 66) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    // Get primary skill icon (use first skill in the array)
    const primarySkill = course.skills?.[0] || '';
    const Icon = primarySkill ? 
        (skillIconMap[primarySkill] || BookOpen) : 
        BookOpen;

    const handleDelete = async (e) => {
        e.stopPropagation();
        
        // Show confirmation toast with action buttons
        toast.warn(
            ({ closeToast }) => (
                <div className="flex flex-col gap-3">
                    <p className="font-medium">Delete Course</p>
                    <p className="text-sm text-gray-600">
                        Are you sure you want to delete "{course.name}"? This action cannot be undone.
                    </p>
                    <div className="flex gap-2 justify-end">
                        <button
                            onClick={() => {
                                closeToast();
                            }}
                            className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={async () => {
                                closeToast();
                                setIsDeleting(true);
                                
                                try {
                                    await onDelete(course.id);
                                    toast.success('Course deleted successfully!');
                                } catch (error) {
                                    console.error('Failed to delete course:', error);
                                    toast.error('Failed to delete course. Please try again.');
                                } finally {
                                    setIsDeleting(false);
                                }
                            }}
                            className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            ),
            {
                autoClose: false,
                closeOnClick: false,
                draggable: false,
                position: 'top-center',
                className: 'custom-toast-confirm',
            }
        );
    };

    return (
        <div
            className="sm:h-[150px] md:h-[180px] border-1 rounded-xl p-3 md:p-5 flex flex-col justify-between shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer hover:bg-gray-50 transform relative group"
            onClick={onClick}
        >
            {/* Delete Button - Top Right Corner */}
            <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700 transition-all duration-200 opacity-0 group-hover:opacity-100 z-10 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Delete Course"
            >
                {isDeleting ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-600 border-t-transparent"></div>
                ) : (
                    <Trash2 className="w-4 h-4" />
                )}
            </button>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
                <h3 className="font-bold lg:text-md md:text-xl text-gray-800 flex items-center gap-2">
                    <Icon className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                    <span>
                        {course.name.length > 20 ? `${course.name.substring(0, 20)}...` : course.name}
                        <div className="text-xs font-normal text-gray-500 mt-1 truncate flex flex-wrap gap-1 mt-1">
                            {(course.skills || []).map((skill, index) => (
                                <span
                                    key={index}
                                    className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </span>
                </h3>
                <div className="bg-blue-100 text-blue-800 px-2 py-1 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-medium mt-1 sm:mt-0">
                    {course.level}
                </div>
            </div>

            <div className="mt-2 md:mt-4">
                <div className="h-2 md:h-3 w-full bg-gray-200 rounded-full overflow-auto mb-1 md:mb-2">
                    <div
                        className={`h-full ${getProgressColor()} transition-all`}
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
                <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-1 xs:gap-0">
                    <p className="text-xs md:text-sm text-gray-500 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-green-500" />
                        {course.completedChapters} / {course.totalChapters} Chapters
                    </p>
                    <p className="text-xs md:text-sm font-medium text-gray-700">
                        {Math.round(progress)}% Complete
                    </p>
                </div>
            </div>

            {/* Assign Mentees Section - Only for Mentors */}
            {user?.userType === "Mentor" && (
                <div
                    className="relative mt-2 md:mt-0"
                    onClick={(e) => e.stopPropagation()}
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