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
    CheckCircle,
    Pencil,
    Download,
    ChevronDown,
    ChevronUp,
    ArrowRight
} from 'lucide-react';
import { useTranslation } from "react-i18next";
import { translateText } from "../../components/language/translateService";
import MakeCertificate from '../../components/course/MakeCertificate';
import EditCourseDetails from '../../components/course/EditCourseDetails';

const CourseDetailPage = () => {
    const { t, i18n } = useTranslation();
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { user } = useUser();
    const [token, setToken] = useState(user?.token || localStorage.getItem('token'));
    const NODE_API = import.meta.env.VITE_NODE_API;
    
    // State management
    const [course, setCourse] = useState(null);
    const [translatedCourse, setTranslatedCourse] = useState(null);
    const [bestAssessmentScore, setBestAssessmentScore] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isTranslating, setIsTranslating] = useState(false);
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

    // Description word limit
    const DESCRIPTION_WORD_LIMIT = 20;

    // Helper function to truncate text
    const truncateText = (text, wordLimit) => {
        if (!text) return '';
        const words = text.split(' ');
        if (words.length <= wordLimit) return text;
        return words.slice(0, wordLimit).join(' ') + '...';
    };

    const shouldShowReadMore = (text) => {
        if (!text) return false;
        return text.split(' ').length > DESCRIPTION_WORD_LIMIT;
    };

    useEffect(() => {
        if (user?.token) {
            setToken(user.token);
        } else if (!token) {
            const storedToken = localStorage.getItem('token');
            if (storedToken) {
                setToken(storedToken);
            }
        }
    }, [user?.token]);

    // Effects
    useEffect(() => {
        if (!token) {
            console.error(t("courseDetails.errors.noToken"));
            return;
        }
        fetchCourseDetails();
    }, [courseId, token]);

    useEffect(() => {
        if (course) {
            translateCourseContent();
        }
    }, [course, i18n.language]);

    // Translation logic
    const translateCourseContent = async () => {
        if (!course || i18n.language === 'en') {
            setTranslatedCourse(course);
            return;
        }

        setIsTranslating(true);
        try {
            const translations = await Promise.all([
                translateText(course.courseName, i18n.language),
                translateText(course.description, i18n.language),
                Promise.all(course.skills.map(skill => translateText(skill, i18n.language))),
                Promise.all(course.courseOutcomes.map(outcome => translateText(outcome, i18n.language))),
                Promise.all(course.chapters.map(async chapter => ({
                    ...chapter,
                    chapterName: await translateText(chapter.chapterName, i18n.language),
                    about: await translateText(chapter.about, i18n.language)
                })))
            ]);

            setTranslatedCourse({
                ...course,
                courseName: translations[0],
                description: translations[1],
                skills: translations[2],
                courseOutcomes: translations[3],
                chapters: translations[4]
            });
        } catch (error) {
            console.error(t("courseDetails.errors.translationError"), error);
            setTranslatedCourse(course);
        } finally {
            setIsTranslating(false);
        }
    };

    // API calls
    const fetchCourseDetails = async () => {
        try {
            const response = await fetch(`${NODE_API}/courses/${courseId}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (response.ok) {
                const data = await response.json();
                setCourse(data);
                checkFinalAssessment(data);
            } else {
                console.error(t("courseDetails.errors.fetchFailed"));
            }
        } catch (error) {
            console.error(t("courseDetails.errors.fetchError"), error);
        }
    };

    const checkFinalAssessment = async (courseData) => {
        try {
            const response = await fetch(`${NODE_API}/assessment/course/${courseId}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (response.ok) {
                const assessments = await response.json();
                const bestScore = Math.max(...assessments.map(a => a.score || 0));
                setBestAssessmentScore(bestScore);

                if (bestScore >= 70 && courseData?.passedFinal === false) {
                    await updateCoursePassedFinal(true);
                    fetchCourseDetails();
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
            const response = await fetch(`${NODE_API}/courses/${courseId}`, {
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

    // Event handlers
    const handleChapterClick = (chapterId) => {
        navigate(`/course/${courseId}/chapter/${chapterId}`);
    };

    const handleEditClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleCourseUpdate = () => {
        fetchCourseDetails();
        setIsModalOpen(false);
    };

    const toggleDescription = () => {
        setIsDescriptionExpanded(!isDescriptionExpanded);
    };

    // Loading state
    if (!course || !translatedCourse) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-pulse text-blue-600 text-xl">
                    {t("courseDetails.loading")}
                </div>
            </div>
        );
    }

    const allChaptersCompleted = translatedCourse?.chapters.every(chapter => chapter.isCompleted);
    const { passedFinal } = translatedCourse || {};

    return (
        <div className="bg-gradient-to-br from-blue-50 to-white min-h-screen md:p-8 px-3">
            {/* Translation loading overlay */}
            {isTranslating && (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <p>{t("courseDetails.translating")}</p>
                    </div>
                </div>
            )}

            <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden">
                {/* Header Section */}
                <div className="bg-blue-600 text-white p-6">
                    <div className="flex items-center space-x-4 mb-4">
                        <button
                            className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition"
                            onClick={() => navigate('/my-courses')}
                            aria-label={t("courseDetails.buttons.back")}
                        >
                            <ArrowLeft className="text-white" size={20} />
                        </button>
                        <h1 className="md:text-3xl text-2xl font-bold flex-grow">
                            {translatedCourse.courseName}
                        </h1>
                        {user.role === "mentor" && (
                            <button 
                                onClick={handleEditClick} 
                                className="text-white p-2 rounded-full hover:bg-white/30"
                                aria-label={t("courseDetails.buttons.edit")}
                            >
                                <Pencil size={20} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Main Content */}
                <div className="p-8">
                    {/* Course Info Grid */}
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        {/* Left Column - Course Details */}
                        <div>
                            <div className="flex items-start mb-4">
                                <BookOpen className="mr-3 text-blue-600 mt-1 flex-shrink-0" size={20} />
                                <div className="text-gray-700">
                                    <strong>{t("courseDetails.description")}:</strong>{' '}
                                    <span>
                                        {isDescriptionExpanded 
                                            ? translatedCourse.description 
                                            : truncateText(translatedCourse.description, DESCRIPTION_WORD_LIMIT)
                                        }
                                    </span>
                                    {shouldShowReadMore(translatedCourse.description) && (
                                        <button
                                            onClick={toggleDescription}
                                            className="ml-2 text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
                                        >
                                            {isDescriptionExpanded ? (
                                                <>
                                                    See less <ChevronUp size={16} className="ml-1" />
                                                </>
                                            ) : (
                                                <>
                                                    See more <ChevronDown size={16} className="ml-1" />
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-start mb-4">
                                <Layers className="mr-3 text-blue-600 mt-1 flex-shrink-0" size={20} />
                                <p className="text-gray-700">
                                    <strong>{t("courseDetails.skills")}:</strong> {translatedCourse.skills.join(', ')}
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 md:gap-4 gap-2 md:text-md text-sm grid-cols-1">
                                <div className="flex items-center">
                                    <Star className="mr-2 text-blue-600 flex-shrink-0" size={20} />
                                    <span><strong>{t("courseDetails.level")}:</strong> {translatedCourse.level}</span>
                                </div>
                                <div className="flex items-center">
                                    <Clock className="mr-2 text-blue-600 flex-shrink-0" size={20} />
                                    <span><strong>{t("courseDetails.duration")}:</strong> {translatedCourse.duration}</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Course Outcomes */}
                        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                            <div className="flex items-center mb-4">
                                <Target className="mr-3 text-blue-600 flex-shrink-0" size={20} />
                                <h2 className="md:text-xl font-semibold">{t("courseDetails.outcomesTitle")}</h2>
                            </div>
                            <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                {translatedCourse.courseOutcomes.map((outcome, index) => (
                                    <li key={index} className="pl-2 md:text-md text-sm">{outcome}</li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Chapters Section */}
                    <h2 className="text-2xl font-semibold mb-6 text-blue-700 border-b md:pb-3">
                        {t("courseDetails.chaptersTitle")}
                    </h2>
                    <div className="space-y-4">
                        {translatedCourse.chapters.map((chapter) => (
                            <div
                                key={chapter._id}
                                className="bg-white border border-blue-100 rounded-xl p-5 
                                           shadow-sm hover:shadow-md transition-all duration-300 
                                           cursor-pointer hover:border-blue-300 
                                           transform hover:-translate-y-1"
                                onClick={() => handleChapterClick(chapter._id)}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-grow">
                                        <h3 className="text-xl font-semibold text-blue-600 mb-2">
                                            {chapter.chapterName}
                                        </h3>
                                        <p className="text-gray-600 mb-2">
                                            <strong>{t("courseDetails.about")}:</strong> {chapter.about}
                                        </p>
                                        <div className="flex items-center text-gray-500">
                                            <Clock className="mr-2 flex-shrink-0" size={16} />
                                            <span>{chapter.duration}</span>
                                        </div>
                                    </div>
                                    <ArrowRight 
                                        className="text-blue-400 hover:text-blue-600 transition-colors duration-200 flex-shrink-0 ml-4" 
                                        size={20} 
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Assessment Section */}
                    <h2 className="text-2xl font-semibold mt-8 mb-4 text-blue-700 border-b pb-3">
                        {t("courseDetails.assessmentTitle")}
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
                            if (!passedFinal && allChaptersCompleted) {
                                navigate(`/course/${courseId}/course-assessment`, {
                                    state: {
                                        topic: translatedCourse.courseName,
                                        skills: translatedCourse.skills,
                                        difficultyLevel: translatedCourse.level,
                                    }
                                });
                            }
                        }}
                    >
                        <div className="flex items-center space-x-3">
                            {passedFinal ? <CheckCircle size={20} className="text-green-600 flex-shrink-0" />
                                : allChaptersCompleted ? <Unlock size={20} className="text-blue-600 flex-shrink-0" />
                                    : <Lock size={20} className="text-gray-500 flex-shrink-0" />
                            }
                            <div>
                                <span className="font-medium text-lg">
                                    {translatedCourse.courseName} {t("courseDetails.finalAssessment")}
                                </span>
                                {bestAssessmentScore !== null && (
                                    <div className="text-sm">
                                        {t("courseDetails.bestScore")}: {bestAssessmentScore}%
                                    </div>
                                )}
                            </div>
                        </div>
                        <span className="font-semibold">
                            {passedFinal ? t("courseDetails.completed") 
                                : allChaptersCompleted ? t("courseDetails.unlocked") 
                                    : t("courseDetails.locked")}
                        </span>
                    </div>
                    
                    {/* Certificate Download Button */}
                    {passedFinal && (
                        <div className="mt-6">
                            <MakeCertificate 
                                course={course}
                                user={user}
                                bestAssessmentScore={bestAssessmentScore}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Course Modal */}
            {isModalOpen && (
                <EditCourseDetails
                    course={course}
                    courseId={courseId}
                    token={token}
                    onClose={handleCloseModal}
                    onUpdate={handleCourseUpdate}
                    NODE_API={NODE_API}
                />
            )}
        </div>
    );
};

export default CourseDetailPage;