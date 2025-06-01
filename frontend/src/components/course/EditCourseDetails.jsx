import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
    BookOpen,
    Clock,
    Target,
    Layers,
    Star,
    Plus,
    Trash2
} from 'lucide-react';
import { useTranslation } from "react-i18next";

const EditCourseDetails = ({ 
    editableCourse, 
    setEditableCourse, 
    handleSaveChanges, 
    handleCloseModal,
    NODE_API,
    token,
    courseId,
    fetchCourseDetails 
}) => {
    const { t } = useTranslation();

    // Add a new chapter to the editable course
    const handleAddChapter = () => {
        if (editableCourse.chapters.length >= 5) {
            alert("A course can have a maximum of 5 chapters only.");
            return;
        }
    
        const newChapter = {
            _id: uuidv4(), // Temporary ID
            chapterName: 'New Chapter',
            about: 'Chapter description',
            duration: '30 mins',
            isCompleted: false
        };
    
        setEditableCourse({
            ...editableCourse,
            chapters: [...editableCourse.chapters, newChapter]
        });
    };

    // Remove a chapter from the editable course
    const handleRemoveChapter = async (index, chapterId) => {
        const updatedChapters = [...editableCourse.chapters];
        updatedChapters.splice(index, 1);
    
        // ✅ Immediately update the UI (temporarily)
        setEditableCourse({
            ...editableCourse,
            chapters: updatedChapters
        });
    
        // ✅ If chapter has a MongoDB _id, send a DELETE request
        if (chapterId) {
            try {
                const response = await fetch(`${NODE_API}/courses/${courseId}/chapters/${chapterId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
    
                if (response.ok) {
                    // ✅ After successful delete, refetch the course from MongoDB
                    fetchCourseDetails();
                } else {
                    console.error('Failed to delete chapter from database');
                }
            } catch (error) {
                console.error('Error deleting chapter:', error);
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-xl shadow-xl w-5/6 overflow-y-auto max-h-[90vh]">
                <h2 className="text-2xl font-semibold mb-4">{t("courseDetails.editTitle")}</h2>

                {/* Editable course content */}
                <div className="space-y-4">
                    <div className="mx-auto bg-white shadow-xl rounded-2xl overflow-hidden">
                        <div className="bg-blue-600 text-white p-6">
                            <div className="flex items-center space-x-4 mb-4">
                                <input
                                    className="text-3xl font-bold flex-grow p-2 border rounded-xl bg-white text-gray-800"
                                    value={editableCourse?.courseName || ''}
                                    onChange={(e) => setEditableCourse({ ...editableCourse, courseName: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="p-8">
                            <div className="grid md:grid-cols-2 gap-6 mb-8">
                                <div>
                                    <div className="flex items-start mb-4">
                                        <BookOpen className="mr-3 text-blue-600 flex-shrink-0 mt-1" size={24} />
                                        <div className="flex-grow">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Description
                                            </label>
                                            <textarea
                                                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                rows="4"
                                                value={editableCourse?.description || ''}
                                                onChange={(e) => setEditableCourse({ ...editableCourse, description: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-start mb-4">
                                        <Layers className="mr-3 text-blue-600 flex-shrink-0 mt-1" size={24} />
                                        <div className="flex-grow">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Skills (comma separated)
                                            </label>
                                            <input
                                                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                value={editableCourse?.skills.join(', ') || ''}
                                                onChange={(e) => setEditableCourse({
                                                    ...editableCourse,
                                                    skills: e.target.value.split(',').map(skill => skill.trim())
                                                })}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex items-center">
                                            <Star className="mr-2 text-blue-600 flex-shrink-0" size={24} />
                                            <div className="flex-grow">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Level
                                                </label>
                                                <input
                                                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    value={editableCourse?.level || ''}
                                                    onChange={(e) => setEditableCourse({ ...editableCourse, level: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <Clock className="mr-2 text-blue-600 flex-shrink-0" size={24} />
                                            <div className="flex-grow">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Duration
                                                </label>
                                                <input
                                                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    value={editableCourse?.duration || ''}
                                                    onChange={(e) => setEditableCourse({ ...editableCourse, duration: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                                    <div className="flex items-center mb-4">
                                        <Target className="mr-3 text-blue-600" size={24} />
                                        <h2 className="text-xl font-semibold">Course Outcomes</h2>
                                    </div>
                                    <textarea
                                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        rows="4"
                                        value={editableCourse?.courseOutcomes.join('\n') || ''}
                                        onChange={(e) => setEditableCourse({
                                            ...editableCourse,
                                            courseOutcomes: e.target.value.split('\n').filter(line => line.trim() !== '')
                                        })}
                                        placeholder="Enter each outcome on a new line"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-semibold text-blue-700">Course Chapters</h2>
                                <button 
                                    onClick={handleAddChapter}
                                    className="flex items-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <Plus size={20} className="mr-2" />
                                    Add Chapter
                                </button>
                            </div>
                            
                            <div className="space-y-4">
                                {editableCourse?.chapters.map((chapter, index) => (
                                    <div
                                        key={chapter._id || chapter.tempId}
                                        className="bg-white border border-blue-100 rounded-xl p-5 relative"
                                    >
                                        <button 
                                            onClick={() => handleRemoveChapter(index, chapter._id)}
                                            className="absolute top-3 right-3 text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                        
                                        <div className="mb-4 pr-8">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Chapter Name</label>
                                            <input
                                                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                value={chapter.chapterName}
                                                onChange={(e) => {
                                                    const updatedChapters = [...editableCourse.chapters];
                                                    updatedChapters[index].chapterName = e.target.value;
                                                    setEditableCourse({ ...editableCourse, chapters: updatedChapters });
                                                }}
                                            />
                                        </div>
                                        <div className="mb-4 pr-8">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">About</label>
                                            <textarea
                                                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                rows="3"
                                                value={chapter.about}
                                                onChange={(e) => {
                                                    const updatedChapters = [...editableCourse.chapters];
                                                    updatedChapters[index].about = e.target.value;
                                                    setEditableCourse({ ...editableCourse, chapters: updatedChapters });
                                                }}
                                            />
                                        </div>
                                        <div className="flex items-center text-gray-500 pr-8">
                                            <Clock className="mr-2 flex-shrink-0" size={20} />
                                            <div className="flex-grow">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                                                <input
                                                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    placeholder="e.g. 30 mins"
                                                    value={chapter.duration}
                                                    onChange={(e) => {
                                                        const updatedChapters = [...editableCourse.chapters];
                                                        updatedChapters[index].duration = e.target.value;
                                                        setEditableCourse({ ...editableCourse, chapters: updatedChapters });
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end space-x-4 mt-6">
                    <button 
                        onClick={handleCloseModal} 
                        className="bg-gray-500 text-white py-3 px-6 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSaveChanges} 
                        className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditCourseDetails;