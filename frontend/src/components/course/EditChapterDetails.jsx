import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
    PlayCircle, 
    Code, 
    FileText,
    Plus,
    Trash2
} from 'lucide-react';
import toast from 'react-hot-toast';

const EditChapterDetails = ({ 
    chapter, 
    isOpen, 
    onClose, 
    onSave, 
    courseId, 
    chapterId, 
    token 
}) => {
    const [editableChapter, setEditableChapter] = useState({ ...chapter });
    const [pptFile, setPptFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const NODE_API = import.meta.env.VITE_NODE_API;

    const handleSaveChanges = async () => {
        setLoading(true);
        try {
            // Step 1: Check if a PPT file was uploaded
            let pptUrl = editableChapter.ppt?.url;

            if (pptFile) {
                const formData = new FormData();
                formData.append('file', pptFile);
                formData.append('upload_preset', 'PDF_Upload');

                // Step 2: Upload to Cloudinary
                const cloudinaryResponse = await fetch(`https://api.cloudinary.com/v1_1/dhk1v7s3d/upload`, {
                    method: 'POST',
                    body: formData,
                });

                if (cloudinaryResponse.ok) {
                    const cloudData = await cloudinaryResponse.json();
                    pptUrl = cloudData.secure_url;
                    console.log("Uploaded PPT URL:", pptUrl);
                } else {
                    toast.error("Failed to upload PPT file");
                    setLoading(false);
                    return;
                }
            }

            // Step 3: Update the chapter with the new PPT URL
            const updatedChapter = {
                ...editableChapter,
                ppt: {
                    ...editableChapter.ppt,
                    link: pptUrl
                }
            };

            // Step 4: Send the updated data to backend
            const response = await fetch(`${NODE_API}/courses/${courseId}/chapters/${chapterId}/layout`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updatedChapter),
            });

            if (response.ok) {
                onSave(updatedChapter);
                onClose();
                toast.success("Chapter updated successfully!");
            } else {
                toast.error("Failed to update chapter");
            }
        } catch (error) {
            console.error('Error updating chapter:', error);
            toast.error("Error updating chapter");
        } finally {
            setLoading(false);
        }
    };

    // Handlers for editable fields
    const handleChapterNameChange = (e) => {
        setEditableChapter({ ...editableChapter, chapterName: e.target.value });
    };

    const handleAboutChange = (e) => {
        setEditableChapter({ ...editableChapter, about: e.target.value });
    };

    const handleDurationChange = (e) => {
        setEditableChapter({ ...editableChapter, duration: e.target.value });
    };

    const handleVideoUrlChange = (e) => {
        setEditableChapter({
            ...editableChapter,
            video: { ...editableChapter.video, url: e.target.value }
        });
    };

    const handleVideoThumbnailChange = (e) => {
        const newThumbnail = e.target.value.trim();
        setEditableChapter({
            ...editableChapter,
            video: {
                ...editableChapter.video,
                thumbnail: newThumbnail || "https://www.fixrunner.com/wp-content/uploads/2021/05/WordPress-Featured-Image-tw.jpg"
            }
        });
    };

    const handleSectionTitleChange = (index, e) => {
        const updatedSections = [...editableChapter.sections];
        updatedSections[index].title = e.target.value;
        setEditableChapter({ ...editableChapter, sections: updatedSections });
    };

    const handleSectionExplanationChange = (index, e) => {
        const updatedSections = [...editableChapter.sections];
        updatedSections[index].explanation = e.target.value;
        setEditableChapter({ ...editableChapter, sections: updatedSections });
    };

    const handleSectionCodeChange = (index, e) => {
        const updatedSections = [...editableChapter.sections];
        updatedSections[index].codeExample = e.target.value;
        setEditableChapter({ ...editableChapter, sections: updatedSections });
    };

    const addNewSection = () => {
        const newSection = {
            _id: uuidv4(),
            title: "New Section",
            explanation: "Enter explanation here",
            codeExample: ""
        };
        setEditableChapter({
            ...editableChapter,
            sections: [...editableChapter.sections, newSection]
        });
    };

    const removeSection = (index) => {
        const updatedSections = [...editableChapter.sections];
        updatedSections.splice(index, 1);
        setEditableChapter({ ...editableChapter, sections: updatedSections });
    };

    const handlePptFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPptFile(file);
        }
    };

    const handlePptTitleChange = (e) => {
        setEditableChapter({
            ...editableChapter,
            ppt: { ...(editableChapter.ppt || {}), title: e.target.value }
        });
    };

    const handlePptUrlChange = (e) => {
        setEditableChapter({
            ...editableChapter,
            ppt: { ...(editableChapter.ppt || {}), url: e.target.value }
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-xl shadow-xl w-5/6 overflow-y-auto max-h-[90vh]">
                <h2 className="text-2xl font-semibold mb-6 text-blue-700">Edit Chapter</h2>

                <div className="space-y-6">
                    {/* Basic Chapter Information */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Chapter Name
                            </label>
                            <input
                                type="text"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={editableChapter.chapterName}
                                onChange={handleChapterNameChange}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                About
                            </label>
                            <textarea
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                rows="3"
                                value={editableChapter.about}
                                onChange={handleAboutChange}
                            ></textarea>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Duration
                            </label>
                            <input
                                type="text"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                value={editableChapter.duration}
                                onChange={handleDurationChange}
                            />
                        </div>
                    </div>

                    {/* Video Section */}
                    <div className="border-t pt-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center text-blue-700">
                            <PlayCircle className="mr-2" size={20} />
                            Video
                        </h3>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Video URL
                                </label>
                                <input
                                    type="text"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={editableChapter.video?.url || ''}
                                    onChange={handleVideoUrlChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Thumbnail URL
                                </label>
                                <input
                                    type="text"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={editableChapter.video?.thumbnail || ''}
                                    onChange={handleVideoThumbnailChange}
                                />
                            </div>
                        </div>
                    </div>

                    {/* PPT Section */}
                    <div className="border-t pt-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center text-blue-700">
                            <FileText className="mr-2" size={20} />
                            Presentation (PPT)
                        </h3>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Presentation Title
                                </label>
                                <input
                                    type="text"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={editableChapter.ppt?.title || ''}
                                    onChange={handlePptTitleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Upload PPT File
                                </label>
                                <input
                                    type="file"
                                    accept=".ppt,.pptx,application/vnd.ms-powerpoint"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    onChange={handlePptFileChange}
                                />
                                {pptFile && (
                                    <p className="text-sm text-green-600 mt-1">
                                        📂 {pptFile.name}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Or Enter PPT URL (Optional)
                                </label>
                                <input
                                    type="text"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={editableChapter.ppt?.url || ''}
                                    onChange={handlePptUrlChange}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Sections */}
                    <div className="border-t pt-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold flex items-center text-blue-700">
                                <Code className="mr-2" size={20} />
                                Sections
                            </h3>
                            <button
                                onClick={addNewSection}
                                className="bg-blue-100 text-blue-700 p-2 rounded-full hover:bg-blue-200 transition-colors"
                                title="Add Section"
                            >
                                <Plus size={20} />
                            </button>
                        </div>
                        
                        <div className="space-y-6">
                            {editableChapter.sections.map((section, index) => (
                                <div 
                                    key={section._id || index} 
                                    className="p-4 border border-gray-200 rounded-lg relative bg-gray-50"
                                >
                                    <button
                                        onClick={() => removeSection(index)}
                                        className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition-colors"
                                        title="Remove Section"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                    
                                    <div className="space-y-3 pr-8">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Section Title
                                            </label>
                                            <input
                                                type="text"
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                value={section.title}
                                                onChange={(e) => handleSectionTitleChange(index, e)}
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Explanation
                                            </label>
                                            <textarea
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                rows="3"
                                                value={section.explanation}
                                                onChange={(e) => handleSectionExplanationChange(index, e)}
                                            ></textarea>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Code Example (optional)
                                            </label>
                                            <textarea
                                                className="w-full p-3 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                rows="5"
                                                value={section.codeExample || ''}
                                                onChange={(e) => handleSectionCodeChange(index, e)}
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end space-x-4 mt-8 pt-6 border-t">
                    <button 
                        onClick={onClose} 
                        className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSaveChanges} 
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditChapterDetails;