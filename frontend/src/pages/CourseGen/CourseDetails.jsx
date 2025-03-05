import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext'; // Fix: Correct hook import

const CourseDetails = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { user } = useUser();  // Extract user from context
    const token = user?.token;

    const [course, setCourse] = useState(null);

    useEffect(() => {
        const fetchCourseDetails = async () => {
            if (!token) {
                console.error('No auth token found');
                return;
            }

            try {
                const response = await fetch(`http://localhost:8000/api/courses/${courseId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,  // Send token here
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setCourse(data);
                } else {
                    console.error('Failed to fetch course data');
                }
            } catch (error) {
                console.error('Error fetching course data:', error);
            }
        };

        fetchCourseDetails();
    }, [courseId, token]);

    const handleChapterClick = (chapterId) => {
        navigate(`/course/${courseId}/chapter/${chapterId}`);
    };

    if (!course) return <p>Loading...</p>;

    return (
        <div className="p-6">
            <button
                className="px-4 py-2 mb-4 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => navigate('/my-courses')}
            >
                Back to My Courses
            </button>

            <h1 className="text-3xl font-bold mb-4">{course.courseName}</h1>
            <p><strong>Description:</strong> {course.description}</p>
            <p><strong>Skills:</strong> {course.skills.join(', ')}</p>
            <p><strong>Level:</strong> {course.level}</p>
            <p><strong>Duration:</strong> {course.duration}</p>
            <p><strong>Course Outcomes:</strong></p>
            <ul className="list-disc pl-6">
                {course.courseOutcomes.map((outcome, index) => (
                    <li key={index}>{outcome}</li>
                ))}
            </ul>

            <h2 className="text-2xl font-semibold mt-6 mb-3">Chapters</h2>
            <div className="space-y-4">
                {course.chapters.map((chapter) => (
                    <div 
                        key={chapter._id} 
                        className="border p-4 rounded-lg shadow cursor-pointer hover:bg-gray-100"
                        onClick={() => handleChapterClick(chapter._id)}
                    >
                        <h3 className="text-xl font-semibold">{chapter.chapterName}</h3>
                        <p><strong>About:</strong> {chapter.about}</p>
                        <p><strong>Duration:</strong> {chapter.duration}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CourseDetails;
