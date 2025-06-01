import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { 
    ArrowLeft, 
    Clock, 
    PlayCircle, 
    CheckCircle, 
    Code, 
    BookOpen,
    Pencil,
    FileText,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Chatbot from '../../components/misc/Chatbot';
import EditChapterDetails from '../../components/course/EditChapterDetails';

const ChapterDetails = () => {
    const { courseId, chapterId } = useParams();
    const [chapter, setChapter] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showFullAbout, setShowFullAbout] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { user, loading } = useUser();
    const token = user?.token;
    const NODE_API = import.meta.env.VITE_NODE_API;

    // Word limit for "About" section
    const ABOUT_WORD_LIMIT = 30;

    const truncateText = (text, limit) => {
        if (!text) return '';
        const words = text.split(' ');
        if (words.length <= limit) return text;
        return words.slice(0, limit).join(' ') + '...';
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Scroll to top on location change (route change)
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    // Additional scroll to top when chapter ID changes
    useEffect(() => {
        // Use setTimeout to ensure DOM is fully rendered
        const timer = setTimeout(() => {
            window.scrollTo(0, 0);
        }, 0);
        
        return () => clearTimeout(timer);
    }, [chapterId]);

    useEffect(() => {
        if (loading) return;
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchChapterDetails = async () => {
            try {
                const response = await fetch(`${NODE_API}/courses/${courseId}/chapters/${chapterId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setChapter(data);
                    console.log("Chapter: ", data);
                    
                    // Scroll to top after data is loaded
                    setTimeout(() => {
                        window.scrollTo(0, 0);
                    }, 0);
                } else {
                    toast.error('Failed to fetch chapter data');
                }
            } catch (error) {
                console.error('Error fetching chapter data:', error);
                toast.error('Error fetching chapter data');
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
            const courseResponse = await fetch(`${NODE_API}/courses/${courseId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!courseResponse.ok) {
                toast.error('Failed to fetch course details');
                return;
            }

            const courseData = await courseResponse.json();
            const chapters = courseData.chapters;
            const currentIndex = chapters.findIndex(ch => ch._id === chapterId);

            if (currentIndex === -1) {
                toast.error('Current chapter not found');
                return;
            }

            const isLastChapter = currentIndex === chapters.length - 1;

            // First update chapter as completed
            const update = await fetch(`${NODE_API}/courses/${courseId}/chapters/${chapterId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ isCompleted: true }),
            });

            if (!update.ok) {
                toast.error('Failed to mark chapter as completed');
                return;
            }

            if (isLastChapter) {
                toast.success("You've completed all chapters! 🎉", {
                    duration: 4000,
                    position: 'top-center'
                });

                // Delay navigation until toast has at least shown
                await new Promise(resolve => setTimeout(resolve, 1500)); // allow toast to render
                navigate(`/course/${courseId}`);
            }else {
                toast.success('Chapter completed! Moving to next chapter...');
                const nextChapter = chapters[currentIndex + 1];
                setChapter(null);

                setTimeout(() => {
                    navigate(`/course/${courseId}/chapter/${nextChapter._id}`, {
                        replace: false,
                        state: { scrollToTop: true }
                    });
                    window.scrollTo(0, 0);
                }, 1000);
            }
        } catch (error) {
            console.error('Error advancing to next chapter:', error);
            toast.error('Error advancing to next chapter');
        }
    };
    const handleEditClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSaveChanges = (updatedChapter) => {
        setChapter(updatedChapter);
    };

    if (loading) {
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

    const aboutText = chapter.about || '';
    const shouldShowToggle = aboutText.split(' ').length > ABOUT_WORD_LIMIT;

    return (
        <div className="bg-gradient-to-br from-blue-50 to-white min-h-screen md:px-8 p-3">
            <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
                    <div className="flex items-center space-x-4 md:mb-4">
                        <button
                            className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors"
                            onClick={() => navigate(`/course/${courseId}`)}
                        >
                            <ArrowLeft className="text-white" size={24} />
                        </button>
                        <h1 className="md:text-3xl text-xl font-bold flex-grow">{chapter.chapterName}</h1>
                        {user?.role === "mentor" && (
                            <button 
                                onClick={handleEditClick} 
                                className="text-white p-2 rounded-full hover:bg-white/30 transition-colors"
                                title="Edit Chapter"
                            >
                                <Pencil size={24} />
                            </button>
                        )}
                    </div>
                </div>

                <div className="md:p-8 px-4 py-6 md:space-y-8 space-y-4">
                    {/* Chapter Info Grid */}
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        <div className="space-y-4">
                            <div className="flex items-start">
                                <BookOpen className="mr-3 mt-1 text-blue-600 flex-shrink-0" size={24} />
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-700 mb-2">About</p>
                                    <p className="text-gray-600 leading-relaxed">
                                        {showFullAbout ? aboutText : truncateText(aboutText, ABOUT_WORD_LIMIT)}
                                    </p>
                                    {shouldShowToggle && (
                                        <button
                                            onClick={() => setShowFullAbout(!showFullAbout)}
                                            className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center transition-colors"
                                        >
                                            {showFullAbout ? (
                                                <>
                                                    <ChevronUp size={16} className="mr-1" />
                                                    See less
                                                </>
                                            ) : (
                                                <>
                                                    <ChevronDown size={16} className="mr-1" />
                                                    See more
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center">
                                <Clock className="mr-3 text-blue-600 flex-shrink-0" size={24} />
                                <div>
                                    <p className="font-semibold text-gray-700">Duration</p>
                                    <p className="text-gray-600">{chapter.duration}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 md:p-6 p-4 rounded-xl border border-blue-200">
                            <div className="flex items-center">
                                <CheckCircle className="mr-3 text-blue-600 flex-shrink-0" size={24} />
                                <div>
                                    <p className="font-semibold text-gray-700">Status</p>
                                    <p className={`font-medium ${chapter.isCompleted ? 'text-green-600' : 'text-orange-600'}`}>
                                        {chapter.isCompleted ? "Completed" : "In Progress"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* PPT Section */}
                    {chapter.ppt && chapter.ppt.link && (
                        <div className="mb-8">
                            <h2 className="text-2xl font-semibold mb-6 text-blue-700 border-b-2 border-blue-100 pb-3 flex items-center">
                                <FileText className="mr-3 flex-shrink-0" size={28} />
                                Presentation
                            </h2>
                            <div className="bg-gradient-to-br from-white to-blue-50 border border-blue-100 rounded-xl md:p-6 p-4
                                           shadow-sm hover:shadow-md transition-all duration-300">
                                <h3 className="text-xl font-semibold text-blue-600 mb-3">
                                    {chapter.ppt.title || "Chapter Presentation"}
                                </h3>
                                <a 
                                    href={chapter.ppt.link} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-4 py-3 bg-blue-600 text-white rounded-lg 
                                              hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
                                >
                                    <FileText className="mr-2 flex-shrink-0" size={20} />
                                    View Presentation
                                </a>
                            </div>
                        </div>
                    )}

                    {/* Sections */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-semibold mb-6 text-blue-700 border-b-2 border-blue-100 pb-3 flex items-center">
                            <Code className="mr-3 flex-shrink-0" size={28} />
                            Content Sections
                        </h2>
                        <div className="space-y-6">
                            {chapter.sections.map((section, index) => (
                                <div 
                                    key={section._id} 
                                    className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl md:p-6 p-4
                                               shadow-sm hover:shadow-md transition-all duration-300"
                                >
                                    <div className="flex items-center mb-3">
                                        <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full mr-3">
                                            {index + 1}
                                        </span>
                                        <h3 className="text-xl font-semibold text-blue-600">
                                            {section.title}
                                        </h3>
                                    </div>
                                    <p className="text-gray-700 mb-4 md:text-base text-sm leading-relaxed">
                                        {section.explanation}
                                    </p>
                                    {section.codeExample && (
                                        <div className="bg-gray-900 md:p-4 p-3 rounded-lg overflow-auto">
                                            <div className="flex items-center mb-2">
                                                <Code className="mr-2 text-green-400" size={16} />
                                                <span className="text-green-400 text-sm font-medium">Code Example</span>
                                            </div>
                                            <pre className="text-green-300 md:text-sm text-xs overflow-x-auto">
                                                <code>{section.codeExample}</code>
                                            </pre>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Video Section */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-semibold mb-6 text-blue-700 border-b-2 border-blue-100 pb-3 flex items-center">
                            <PlayCircle className="mr-3 flex-shrink-0" size={28} />
                            Video Lesson
                        </h2>
                        {chapter.video?.url ? (
                            <div 
                                className="relative w-full max-w-3xl mx-auto cursor-pointer group" 
                                onClick={() => window.open(chapter.video.url, '_blank')}
                            >
                                <img 
                                    src={chapter.video.thumbnail || "https://www.fixrunner.com/wp-content/uploads/2021/05/WordPress-Featured-Image-tw.jpg"} 
                                    alt="Video Thumbnail" 
                                    className="w-full rounded-xl shadow-lg 
                                               group-hover:opacity-90 transition-opacity duration-300"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="bg-blue-600 p-4 rounded-full 
                                                    group-hover:scale-110 transition-transform duration-300
                                                    shadow-xl opacity-90 hover:opacity-100">
                                        <PlayCircle size={60} className="text-white" />
                                    </div>
                                </div>
                                <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-lg text-sm">
                                    Click to watch video
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                                <PlayCircle className="mx-auto text-gray-400 mb-4" size={64} />
                                <p className="text-gray-500 text-lg">No video available for this chapter</p>
                            </div>
                        )}
                    </div>

                    {/* Complete Chapter Button */}
                    <div className="text-center pt-6 border-t-2 border-blue-100">
                        <button
                            className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl 
                                       hover:from-green-600 hover:to-green-700 transition-all duration-300
                                       flex items-center justify-center mx-auto text-lg font-semibold
                                       shadow-lg hover:shadow-xl transform hover:scale-105"
                            onClick={handleNextChapter}
                        >
                            <CheckCircle className="mr-3 flex-shrink-0" size={24} />
                            Mark as Completed & Continue
                        </button>
                        <p className="text-gray-500 text-sm mt-2">
                            Complete this chapter to unlock the next one
                        </p>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {isModalOpen && chapter && (
                <EditChapterDetails
                    chapter={chapter}
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSave={handleSaveChanges}
                    courseId={courseId}
                    chapterId={chapterId}
                    token={token}
                />
            )}

            <Chatbot />
        </div>
    );
};

export default ChapterDetails;