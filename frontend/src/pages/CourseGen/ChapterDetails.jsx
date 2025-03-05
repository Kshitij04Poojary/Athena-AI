import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

const ChapterDetails = () => {
    const { courseId, chapterId } = useParams();
    const [chapter, setChapter] = useState(null);
    const navigate = useNavigate();
    const user = useUser();
    const token = user?.token;

    useEffect(() => {
        const fetchChapterDetails = async () => {
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
    }, [courseId, chapterId, token]);

    const handleNextChapter = async () => {
        try {
            // Mark current chapter as completed
            await fetch(`http://localhost:8000/api/courses/${courseId}/chapters/${chapterId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ isCompleted: true }),
            });

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
                navigate(`/course/${courseId}/chapters/${nextChapter._id}`);
            } else {
                alert("You've completed all chapters!");
                navigate(`/course/${courseId}`);
            }
        } catch (error) {
            console.error('Error advancing to next chapter:', error);
        }
    };

    if (!chapter) return <p>Loading chapter details...</p>;

    return (
        <div className="p-6 space-y-4">
            <button 
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => navigate(`/course/${courseId}`)}
            >
                Back to Course Details
            </button>

            <h1 className="text-3xl font-bold">{chapter.chapterName}</h1>
            <p><strong>About:</strong> {chapter.about}</p>
            <p><strong>Duration:</strong> {chapter.duration}</p>

            <h2 className="text-2xl font-semibold mt-4">Sections</h2>
            <div className="space-y-4">
                {chapter.sections.map((section) => (
                    <div key={section._id} className="p-4 border rounded-lg shadow">
                        <h3 className="text-xl font-semibold">{section.title}</h3>
                        <p>{section.explanation}</p>
                        {section.codeExample && (
                            <pre className="bg-gray-100 p-2 rounded mt-2 overflow-auto">
                                <code>{section.codeExample}</code>
                            </pre>
                        )}
                    </div>
                ))}
            </div>

            <h2 className="text-2xl font-semibold mt-4">Video</h2>
            {chapter.video?.thumbnail ? (
                <div 
                    className="relative w-full max-w-2xl cursor-pointer" 
                    onClick={() => window.open(chapter.video?.url, '_blank')}
                >
                    <img 
                        src={chapter.video.thumbnail} 
                        alt="Video Thumbnail" 
                        className="w-full rounded-lg"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="80" 
                            height="80" 
                            viewBox="0 0 24 24" 
                            fill="white" 
                            className="drop-shadow-lg"
                        >
                            <path d="M7 6v12l10-6z" />
                        </svg>
                    </div>
                </div>
            ) : (
                <p>No video available for this chapter.</p>
            )}

            <p><strong>Status:</strong> {chapter.isCompleted ? "Completed" : "Not Completed"}</p>

            <button
                className="mt-6 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                onClick={handleNextChapter}
            >
                Mark as Completed & Next
            </button>
        </div>
    );
};

export default ChapterDetails;
