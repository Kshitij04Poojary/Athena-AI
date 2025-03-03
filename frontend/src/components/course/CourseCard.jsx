import React from 'react';

const CourseCard = ({ course }) => {
    return (
        <div className="border rounded-lg p-4 shadow hover:shadow-lg transition">
            <h3 className="font-semibold text-lg">{course.name}</h3>
            <p className="text-gray-600">Topic: {course.topic}</p>
            <p className="text-gray-600">Level: {course.level}</p>
            <div className="mt-2">
                <div className="h-3 w-52 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-blue-500"
                        style={{ width: `${(course.completedChapters / course.totalChapters) * 100}%` }}
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
