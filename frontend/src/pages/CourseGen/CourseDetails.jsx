import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import {
    ArrowLeft,
    BookOpen,
    Clock,
    Target,
    Layers,
    Star,
    Lock,
    Unlock,
    CheckCircle
} from 'lucide-react';

const CourseDetails = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { user } = useUser();
    const token = user?.token;

    const [course, setCourse] = useState(null);
    const [bestAssessmentScore, setBestAssessmentScore] = useState(null);

    useEffect(() => {
        if (!token) {
            console.error('No auth token found');
            return;
        }
        fetchCourseDetails();
    }, [courseId, token]);

    const fetchCourseDetails = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/courses/${courseId}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (response.ok) {
                const data = await response.json();
                setCourse(data);
                checkFinalAssessment(data); // Fetch assessment data after course loads
            } else {
                console.error('Failed to fetch course data');
            }
        } catch (error) {
            console.error('Error fetching course data:', error);
        }
    };

    const checkFinalAssessment = async (courseData) => {
        try {
            const response = await fetch(`http://localhost:8000/api/assessment/course/${courseId}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (response.ok) {
                const assessments = await response.json();
                const bestScore = Math.max(...assessments.map(a => a.score || 0));
                setBestAssessmentScore(bestScore);

                if (bestScore >= 70 && courseData?.passedFinal === false) {
                    await updateCoursePassedFinal(true);
                    fetchCourseDetails();  // Re-fetch course after updating status
                }
            } else {
                console.log('No assessments found for this course.');
            }
        } catch (error) {
            console.error('Error fetching assessments:', error);
        }
    };

    const updateCoursePassedFinal = async (status) => {
        try {
            console.log("Updating course passedFinal status to:", status);
            const response = await fetch(`http://localhost:8000/api/courses/${courseId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ passedFinal: status }),
            });

            if (!response.ok) {
                console.error('Failed to update course passedFinal status');
            }
        } catch (error) {
            console.error('Error updating course status:', error);
        }
    };

    const handleChapterClick = (chapterId) => {
        navigate(`/course/${courseId}/chapter/${chapterId}`);
    };

    const allChaptersCompleted = course?.chapters.every(chapter => chapter.isCompleted);
    const { passedFinal } = course || {};

    if (!course) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-pulse text-blue-600 text-xl">Loading Course Details...</div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-blue-50 to-white min-h-screen p-8">
            <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden">
                <div className="bg-blue-600 text-white p-6">
                    <div className="flex items-center space-x-4 mb-4">
                        <button
                            className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition"
                            onClick={() => navigate('/my-courses')}
                        >
                            <ArrowLeft className="text-white" size={24} />
                        </button>
                        <h1 className="text-3xl font-bold flex-grow">{course.courseName}</h1>
                    </div>
                </div>

                <div className="p-8">
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        <div>
                            <div className="flex items-center mb-4">
                                <BookOpen className="mr-3 text-blue-600" size={24} />
                                <p className="text-gray-700"><strong>Description:</strong> {course.description}</p>
                            </div>

                            <div className="flex items-center mb-4">
                                <Layers className="mr-3 text-blue-600" size={24} />
                                <p className="text-gray-700">
                                    <strong>Skills:</strong> {course.skills.join(', ')}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center">
                                    <Star className="mr-2 text-blue-600" size={20} />
                                    <span><strong>Level:</strong> {course.level}</span>
                                </div>
                                <div className="flex items-center">
                                    <Clock className="mr-2 text-blue-600" size={20} />
                                    <span><strong>Duration:</strong> {course.duration}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                            <div className="flex items-center mb-4">
                                <Target className="mr-3 text-blue-600" size={24} />
                                <h2 className="text-xl font-semibold">Course Outcomes</h2>
                            </div>
                            <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                {course.courseOutcomes.map((outcome, index) => (
                                    <li key={index} className="pl-2">{outcome}</li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <h2 className="text-2xl font-semibold mb-6 text-blue-700 border-b pb-3">
                        Course Chapters
                    </h2>
                    <div className="space-y-4">
                        {course.chapters.map((chapter) => (
                            <div
                                key={chapter._id}
                                className="bg-white border border-blue-100 rounded-xl p-5 
                                           shadow-sm hover:shadow-md transition-all duration-300 
                                           cursor-pointer hover:border-blue-300 
                                           transform hover:-translate-y-1"
                                onClick={() => handleChapterClick(chapter._id)}
                            >
                                <h3 className="text-xl font-semibold text-blue-600 mb-2">
                                    {chapter.chapterName}
                                </h3>
                                <p className="text-gray-600 mb-2">
                                    <strong>About:</strong> {chapter.about}
                                </p>
                                <div className="flex items-center text-gray-500">
                                    <Clock className="mr-2" size={16} />
                                    <span>{chapter.duration}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <h2 className="text-2xl font-semibold mt-8 mb-4 text-blue-700 border-b pb-3">
                        Final Assessment
                    </h2>

                    <div
                        className={`flex items-center justify-between p-5 rounded-xl shadow-md border
                                    ${passedFinal
                                        ? 'bg-green-50 border-green-200 text-green-700'
                                        : allChaptersCompleted
                                            ? 'bg-blue-50 border-blue-200 text-blue-700 cursor-pointer hover:bg-blue-100'
                                            : 'bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed'
                                    }`}
                        onClick={() => {
                            if (allChaptersCompleted) {
                                navigate(`/course/${courseId}/course-assessment`, {
                                    state: {
                                        topic: course.courseName,
                                        skills: course.skills,
                                        difficultyLevel: course.level,
                                    }
                                });
                            }
                        }}
                    >
                        <div className="flex items-center space-x-3">
                            {passedFinal ? <CheckCircle size={24} className="text-green-600" />
                                : allChaptersCompleted ? <Unlock size={24} className="text-blue-600" />
                                    : <Lock size={24} className="text-gray-500" />
                            }
                            <div>
                                <span className="font-medium text-lg">{course.courseName} Final Assessment</span>
                                {bestAssessmentScore !== null && <div className="text-sm">Best Score: {bestAssessmentScore}%</div>}
                            </div>
                        </div>
                        <span className="font-semibold">{passedFinal ? "Completed" : allChaptersCompleted ? "Unlocked" : "Locked"}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetails;
