import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { 
  ArrowLeft, 
  BookOpen, 
  Clock, 
  Target, 
  Layers, 
  Star 
} from 'lucide-react';

const CourseDetails = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { user } = useUser();
    const token = user?.token;

    const [course, setCourse] = useState(null);

    useEffect(() => {
        const fetchCourseDetails = async () => {
            if (!token) {
                console.error('No auth token found');
                return;
            }
            console.log("Token: ",token);

            try {
                const response = await fetch(`http://localhost:8000/api/courses/${courseId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
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

    if (!course) return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-pulse text-blue-600 text-xl">Loading Course Details...</div>
        </div>
    );

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
                </div>
            </div>
        </div>
    );
};

export default CourseDetails;