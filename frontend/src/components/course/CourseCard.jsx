import React from 'react';

const CourseCard = ({ course, onClick }) => {
    const progress = course.totalChapters > 0 
        ? (course.completedChapters / course.totalChapters) * 100 
        : 0;

    return (
        <div 
            className="border rounded-lg p-4 shadow hover:shadow-xl transition cursor-pointer bg-white hover:bg-gray-50"
            onClick={onClick}  // Allow navigation on click
        >
            <h3 className="font-semibold text-lg mb-1">{course.name}</h3>
            <p className="text-gray-600">Topic: {course.topic}</p>
            <p className="text-gray-600">Level: {course.level}</p>
            <div className="mt-3">
                <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-blue-500 transition-all"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                    {course.completedChapters} / {course.totalChapters} Chapters Completed
                </p>
            </div>
        </div>
    );
};

export default CourseCard;
