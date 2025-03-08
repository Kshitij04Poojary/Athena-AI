import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { 
    ArrowLeft, 
    Clock, 
    PlayCircle, 
    CheckCircle, 
    Code, 
    BookOpen 
} from 'lucide-react';
import Chatbot from '../../components/Chatbot';

const ChapterDetails = () => {
    const { courseId, chapterId } = useParams();
    const [chapter, setChapter] = useState(null);
    const navigate = useNavigate();
    const { user, loading } = useUser(); // ✅ Use loading state
    const token = user?.token;
    //console.log("Token: ",token);

    useEffect(() => {
        if (loading) return; // ✅ Don't fetch until user is fully loaded
        if (!token) {
            navigate('/login'); // ✅ Redirect if no token after loading
            return;
        }

        const fetchChapterDetails = async () => {
            //console.log("Token: ",token);
            try {
                const response = await fetch(`http://localhost:8000/api/courses/${courseId}/chapters/${chapterId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setChapter(data);
                } else {
                    console.error('Failed to fetch chapter data');
                }
            } catch (error) {
                console.error('Error fetching chapter data:', error);
            }
        };

        fetchChapterDetails();
    }, [courseId, chapterId, token, loading, navigate]);

    const handleNextChapter = async () => {
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            // Mark current chapter as completed
            const update = await fetch(`http://localhost:8000/api/courses/${courseId}/chapters/${chapterId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ isCompleted: true }),
            });
            console.log("Update: ",update);

            // Fetch full course details to get chapter list
            const courseResponse = await fetch(`http://localhost:8000/api/courses/${courseId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!courseResponse.ok) throw new Error('Failed to fetch course details');

            const courseData = await courseResponse.json();
            const chapters = courseData.chapters;

            const currentIndex = chapters.findIndex(ch => ch._id === chapterId);
            const nextChapter = chapters[currentIndex + 1];

            if (nextChapter) {
                navigate(`/course/${courseId}/chapter/${nextChapter._id}`);
            } else {
                alert("You've completed all chapters!");
                navigate(`/course/${courseId}`);
            }
        } catch (error) {
            console.error('Error advancing to next chapter:', error);
        }
    };

    if (loading) {
        // ✅ Show a loading screen while user/token is being fetched
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-pulse text-blue-600 text-xl">Loading User...</div>
            </div>
        );
    }

    if (!chapter) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-pulse text-blue-600 text-xl">Loading Chapter Details...</div>
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
                            onClick={() => navigate(`/course/${courseId}`)}
                        >
                            <ArrowLeft className="text-white" size={24} />
                        </button>
                        <h1 className="text-3xl font-bold flex-grow">{chapter.chapterName}</h1>
                    </div>
                </div>

                <div className="p-8 space-y-6">
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <div className="flex items-start mb-4">
                                <BookOpen className="mr-3 mt-1 text-blue-600" size={24} />
                                <div>
                                    <p className="font-semibold text-gray-700">About</p>
                                    <p className="text-gray-600">{chapter.about}</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <Clock className="mr-3 text-blue-600" size={24} />
                                <p><strong>Duration:</strong> {chapter.duration}</p>
                            </div>
                        </div>

                        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                            <div className="flex items-center mb-4">
                                <CheckCircle className="mr-3 text-blue-600" size={24} />
                                <p className="font-semibold">
                                    Status: {chapter.isCompleted ? "Completed" : "Not Completed"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold mb-6 text-blue-700 border-b pb-3 flex items-center">
                            <Code className="mr-3" size={28} />
                            Sections
                        </h2>
                        <div className="space-y-4">
                            {chapter.sections.map((section) => (
                                <div 
                                    key={section._id} 
                                    className="bg-white border border-blue-100 rounded-xl p-5 
                                               shadow-sm hover:shadow-md transition-all duration-300"
                                >
                                    <h3 className="text-xl font-semibold text-blue-600 mb-3">
                                        {section.title}
                                    </h3>
                                    <p className="text-gray-600 mb-3">{section.explanation}</p>
                                    {section.codeExample && (
                                        <pre className="bg-blue-50 p-4 rounded-lg overflow-auto text-sm">
                                            <code className="text-gray-800">{section.codeExample}</code>
                                        </pre>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold mb-6 text-blue-700 border-b pb-3 flex items-center">
                            <PlayCircle className="mr-3" size={28} />
                            Video
                        </h2>
                        {chapter.video?.thumbnail ? (
                            <div 
                                className="relative w-full max-w-2xl mx-auto cursor-pointer group" 
                                onClick={() => window.open(chapter.video?.url, '_blank`')}
                            >
                                <img 
                                    src={chapter.video.thumbnail} 
                                    alt="Video Thumbnail" 
                                    className="w-full rounded-xl shadow-lg 
                                               group-hover:opacity-80 transition-opacity duration-300"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="bg-blue-500 p-4 rounded-full 
                                                    group-hover:scale-110 transition-transform 
                                                    shadow-xl opacity-90">
                                        <PlayCircle size={60} className="text-white" />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center">No video available for this chapter.</p>
                        )}
                    </div>

                    <div className="mt-8 text-center">
                        <button
                            className="px-6 py-3 bg-green-500 text-white rounded-lg 
                                       hover:bg-green-600 transition flex items-center justify-center mx-auto"
                            onClick={handleNextChapter}
                        >
                            <CheckCircle className="mr-2" size={20} />
                            Mark as Completed & Next
                        </button>
                    </div>
                </div>
            </div>
            <Chatbot/>
        </div>
    );
};

export default ChapterDetails;
