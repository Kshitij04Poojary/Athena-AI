import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Loader2, CheckCircle, BookOpen, Award, Briefcase, Target, School } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';
import ActivityCard from './ActivityCard';
import "../pages/VideoConferencing/Style.css";

const MenteeProfileForm = ({ onComplete, initialData = {} }) => {
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        academics: {
            class10: { school: '', percentage: '', yearOfCompletion: '' },
            class12: { school: '', percentage: '', yearOfCompletion: '' },
            currentEducation: {
                institution: '', course: '', specialization: '',
                yearOfStudy: '', cgpa: ''
            }
        },
        hasExtracurricular: false,
        extracurricular: [],
        hasInternships: false,
        internships: [],
        hasAchievements: false,
        achievements: [],
        futureGoals: {
            shortTerm: '',
            longTerm: '',
            dreamCompanies: []
        },
        ...initialData
    });

    const [newSkill, setNewSkill] = useState('');
    const [newDreamCompany, setNewDreamCompany] = useState('');
    const [errors, setErrors] = useState({});

    const STEPS = [
        { id: 1, label: 'Academics', icon: <School size={20} /> },
        { id: 2, label: 'Experience', icon: <Briefcase size={20} /> },
        { id: 3, label: 'Goals', icon: <Target size={20} /> }
    ];

    const validateStep = (stepNumber) => {
        const newErrors = {};
        switch (stepNumber) {
            case 1: // Academics
                if (!formData.academics.class10.school || !formData.academics.class10.percentage) {
                    newErrors.class10 = 'Class 10 details are required';
                }
                if (!formData.academics.class12.school || !formData.academics.class12.percentage) {
                    newErrors.class12 = 'Class 12 details are required';
                }
                if (!formData.academics.currentEducation.institution) {
                    newErrors.currentEducation = 'Current education details are required';
                }
                break;
            case 2: // Experience
                // Optional sections, no validation needed
                break;
            case 3: // Goals
                if (!formData.futureGoals.shortTerm) {
                    newErrors.shortTerm = 'Short term goals are required';
                }
                if (!formData.futureGoals.longTerm) {
                    newErrors.longTerm = 'Long term goals are required';
                }
                break;
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateStep(step)) return;
        
        setIsLoading(true);
        try {
            const response = await axios.post(
                'http://localhost:8000/api/mentee/profile',
                formData,
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                }
            );
            toast.success('Profile updated successfully!');
            onComplete(response.data);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddItem = (type) => {
        const newItems = {
            extracurricular: { activity: '', role: '', duration: '', description: '' },
            internships: { company: '', role: '', duration: '', description: '' },
            achievements: { title: '', year: new Date().getFullYear(), description: '' }
        };

        setFormData({
            ...formData,
            [type]: [...formData[type], newItems[type]]
        });
    };

    const handleDeleteItem = (type, index) => {
        setFormData({
            ...formData,
            [type]: formData[type].filter((_, i) => i !== index)
        });
    };

    const handleUpdateItem = (type, index, updatedItem) => {
        const newItems = [...formData[type]];
        newItems[index] = updatedItem;
        setFormData({
            ...formData,
            [type]: newItems
        });
    };

    const handleAddDreamCompany = () => {
        if (newDreamCompany && !formData.futureGoals.dreamCompanies.includes(newDreamCompany)) {
            setFormData({
                ...formData,
                futureGoals: {
                    ...formData.futureGoals,
                    dreamCompanies: [...formData.futureGoals.dreamCompanies, newDreamCompany]
                }
            });
            setNewDreamCompany('');
        }
    };

    const handleRemoveDreamCompany = (index) => {
        setFormData({
            ...formData,
            futureGoals: {
                ...formData.futureGoals,
                dreamCompanies: formData.futureGoals.dreamCompanies.filter((_, i) => i !== index)
            }
        });
    };

    const renderAcademicForm = () => (
        <motion.div
            key="academics"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
        >
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
                <School size={24} />
                Academic Information
            </h2>

            {/* Class 10 */}
            <div className="glass-card p-6 rounded-xl space-y-4">
                <h3 className="text-lg font-semibold">Class 10</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">School Name</label>
                        <input
                            type="text"
                            value={formData.academics.class10.school}
                            onChange={(e) => setFormData({
                                ...formData,
                                academics: {
                                    ...formData.academics,
                                    class10: {
                                        ...formData.academics.class10,
                                        school: e.target.value
                                    }
                                }
                            })}
                            className="modal-input w-full p-3 rounded-lg"
                            placeholder="Enter school name"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Percentage</label>
                        <input
                            type="number"
                            value={formData.academics.class10.percentage}
                            onChange={(e) => setFormData({
                                ...formData,
                                academics: {
                                    ...formData.academics,
                                    class10: {
                                        ...formData.academics.class10,
                                        percentage: e.target.value
                                    }
                                }
                            })}
                            className="modal-input w-full p-3 rounded-lg"
                            placeholder="Enter percentage"
                            min="0"
                            max="100"
                            step="0.01"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Year of Completion</label>
                        <input
                            type="number"
                            value={formData.academics.class10.yearOfCompletion}
                            onChange={(e) => setFormData({
                                ...formData,
                                academics: {
                                    ...formData.academics,
                                    class10: {
                                        ...formData.academics.class10,
                                        yearOfCompletion: e.target.value
                                    }
                                }
                            })}
                            className="modal-input w-full p-3 rounded-lg"
                            placeholder="Enter year"
                            min="2000"
                            max={new Date().getFullYear()}
                        />
                    </div>
                </div>
            </div>

            {/* Class 12 Section */}
            <div className="glass-card p-6 rounded-xl space-y-4">
                <h3 className="text-lg font-semibold">Class 12</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">School Name</label>
                        <input
                            type="text"
                            value={formData.academics.class12.school}
                            onChange={(e) => setFormData({
                                ...formData,
                                academics: {
                                    ...formData.academics,
                                    class12: {
                                        ...formData.academics.class12,
                                        school: e.target.value
                                    }
                                }
                            })}
                            className="modal-input w-full p-3 rounded-lg"
                            placeholder="Enter school name"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Percentage</label>
                        <input
                            type="number"
                            value={formData.academics.class12.percentage}
                            onChange={(e) => setFormData({
                                ...formData,
                                academics: {
                                    ...formData.academics,
                                    class12: {
                                        ...formData.academics.class12,
                                        percentage: e.target.value
                                    }
                                }
                            })}
                            className="modal-input w-full p-3 rounded-lg"
                            placeholder="Enter percentage"
                            min="0"
                            max="100"
                            step="0.01"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Year of Completion</label>
                        <input
                            type="number"
                            value={formData.academics.class12.yearOfCompletion}
                            onChange={(e) => setFormData({
                                ...formData,
                                academics: {
                                    ...formData.academics,
                                    class12: {
                                        ...formData.academics.class12,
                                        yearOfCompletion: e.target.value
                                    }
                                }
                            })}
                            className="modal-input w-full p-3 rounded-lg"
                            placeholder="Enter year"
                            min="2000"
                            max={new Date().getFullYear()}
                        />
                    </div>
                </div>
            </div>

            {/* Current Education Section */}
            <div className="glass-card p-6 rounded-xl space-y-4">
                <h3 className="text-lg font-semibold">Current Education</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Institution Name</label>
                        <input
                            type="text"
                            value={formData.academics.currentEducation.institution}
                            onChange={(e) => setFormData({
                                ...formData,
                                academics: {
                                    ...formData.academics,
                                    currentEducation: {
                                        ...formData.academics.currentEducation,
                                        institution: e.target.value
                                    }
                                }
                            })}
                            className="modal-input w-full p-3 rounded-lg"
                            placeholder="Enter institution name"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                        <input
                            type="text"
                            value={formData.academics.currentEducation.course}
                            onChange={(e) => setFormData({
                                ...formData,
                                academics: {
                                    ...formData.academics,
                                    currentEducation: {
                                        ...formData.academics.currentEducation,
                                        course: e.target.value
                                    }
                                }
                            })}
                            className="modal-input w-full p-3 rounded-lg"
                            placeholder="e.g., B.Tech, BCA"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                        <input
                            type="text"
                            value={formData.academics.currentEducation.specialization}
                            onChange={(e) => setFormData({
                                ...formData,
                                academics: {
                                    ...formData.academics,
                                    currentEducation: {
                                        ...formData.academics.currentEducation,
                                        specialization: e.target.value
                                    }
                                }
                            })}
                            className="modal-input w-full p-3 rounded-lg"
                            placeholder="e.g., Computer Science"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Year of Study</label>
                        <select
                            value={formData.academics.currentEducation.yearOfStudy}
                            onChange={(e) => setFormData({
                                ...formData,
                                academics: {
                                    ...formData.academics,
                                    currentEducation: {
                                        ...formData.academics.currentEducation,
                                        yearOfStudy: e.target.value
                                    }
                                }
                            })}
                            className="modal-input w-full p-3 rounded-lg"
                        >
                            <option value="">Select Year</option>
                            <option value="1">1st Year</option>
                            <option value="2">2nd Year</option>
                            <option value="3">3rd Year</option>
                            <option value="4">4th Year</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">CGPA</label>
                        <input
                            type="number"
                            value={formData.academics.currentEducation.cgpa}
                            onChange={(e) => setFormData({
                                ...formData,
                                academics: {
                                    ...formData.academics,
                                    currentEducation: {
                                        ...formData.academics.currentEducation,
                                        cgpa: e.target.value
                                    }
                                }
                            })}
                            className="modal-input w-full p-3 rounded-lg"
                            placeholder="Enter CGPA"
                            min="0"
                            max="10"
                            step="0.01"
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    );

    const renderExperienceForm = () => (
        <motion.div
            key="experience"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
        >
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
                <Briefcase size={24} />
                Experience & Activities
            </h2>

            {/* Extracurricular Activities */}
            <ExperienceSection
                title="Extracurricular Activities"
                icon={<Award size={20} className="text-purple-500" />}
                hasItems={formData.hasExtracurricular}
                items={formData.extracurricular}
                type="extracurricular"
                onToggle={(checked) => setFormData({
                    ...formData,
                    hasExtracurricular: checked,
                    extracurricular: checked ? formData.extracurricular : []
                })}
                onAdd={() => handleAddItem('extracurricular')}
                onDelete={(index) => handleDeleteItem('extracurricular', index)}
                onUpdate={(index, item) => handleUpdateItem('extracurricular', index, item)}
            />

            {/* Internships */}
            <ExperienceSection
                title="Internships"
                icon={<Briefcase size={20} className="text-blue-500" />}
                hasItems={formData.hasInternships}
                items={formData.internships}
                type="internship"
                onToggle={(checked) => setFormData({
                    ...formData,
                    hasInternships: checked,
                    internships: checked ? formData.internships : []
                })}
                onAdd={() => handleAddItem('internships')}
                onDelete={(index) => handleDeleteItem('internships', index)}
                onUpdate={(index, item) => handleUpdateItem('internships', index, item)}
            />

            {/* Achievements */}
            <ExperienceSection
                title="Achievements"
                icon={<Award size={20} className="text-yellow-500" />}
                hasItems={formData.hasAchievements}
                items={formData.achievements}
                type="achievement"
                onToggle={(checked) => setFormData({
                    ...formData,
                    hasAchievements: checked,
                    achievements: checked ? formData.achievements : []
                })}
                onAdd={() => handleAddItem('achievements')}
                onDelete={(index) => handleDeleteItem('achievements', index)}
                onUpdate={(index, item) => handleUpdateItem('achievements', index, item)}
            />
        </motion.div>
    );

    const renderGoalsForm = () => (
        <motion.div
            key="goals"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
        >
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
                <Target size={24} />
                Future Goals
            </h2>

            <div className="glass-card p-6 rounded-xl space-y-6">
                {/* Short Term Goals */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Short Term Goals (Next 1-2 years)
                    </label>
                    <textarea
                        value={formData.futureGoals.shortTerm}
                        onChange={(e) => setFormData({
                            ...formData,
                            futureGoals: {
                                ...formData.futureGoals,
                                shortTerm: e.target.value
                            }
                        })}
                        className="modal-input w-full p-3 rounded-lg min-h-[100px]"
                        placeholder="Describe your short term goals..."
                    />
                    {errors.shortTerm && (
                        <p className="text-red-500 text-sm mt-1">{errors.shortTerm}</p>
                    )}
                </div>

                {/* Long Term Goals */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Long Term Goals (5+ years)
                    </label>
                    <textarea
                        value={formData.futureGoals.longTerm}
                        onChange={(e) => setFormData({
                            ...formData,
                            futureGoals: {
                                ...formData.futureGoals,
                                longTerm: e.target.value
                            }
                        })}
                        className="modal-input w-full p-3 rounded-lg min-h-[100px]"
                        placeholder="Describe your long term goals..."
                    />
                    {errors.longTerm && (
                        <p className="text-red-500 text-sm mt-1">{errors.longTerm}</p>
                    )}
                </div>

                {/* Dream Companies */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dream Companies
                    </label>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {formData.futureGoals.dreamCompanies.map((company, index) => (
                            <motion.div
                                key={index}
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2"
                            >
                                {company}
                                <button
                                    onClick={() => handleRemoveDreamCompany(index)}
                                    className="hover:text-red-500"
                                >
                                    <X size={14} />
                                </button>
                            </motion.div>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newDreamCompany}
                            onChange={(e) => setNewDreamCompany(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddDreamCompany()}
                            className="modal-input flex-1 p-3 rounded-lg"
                            placeholder="Add a dream company"
                        />
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleAddDreamCompany}
                            className="gradient-button p-3 rounded-lg"
                        >
                            <Plus size={20} />
                        </motion.button>
                    </div>
                </div>
            </div>
        </motion.div>
    );

    const renderStepContent = () => {
        switch (step) {
            case 1:
                return renderAcademicForm();
            case 2:
                return renderExperienceForm();
            case 3:
                return renderGoalsForm();
            default:
                return null;
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="glass-card rounded-2xl p-8">
                {/* Progress Steps */}
                <div className="mb-8">
                    <div className="flex justify-between mb-2">
                        {STEPS.map((stepItem, index) => (
                            <motion.button
                                key={index}
                                onClick={() => validateStep(step) && setStep(stepItem.id)}
                                className={`flex flex-col items-center ${
                                    step >= stepItem.id ? 'text-blue-600' : 'text-gray-400'
                                }`}
                                whileHover={{ scale: 1.05 }}
                            >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                    step >= stepItem.id 
                                        ? 'bg-blue-600 text-white' 
                                        : 'bg-gray-200'
                                }`}>
                                    {step > stepItem.id ? <CheckCircle size={16} /> : stepItem.id}
                                </div>
                                <span className="text-sm mt-1">{stepItem.label}</span>
                            </motion.button>
                        ))}
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                        <motion.div
                            className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
                            style={{ width: `${(step / STEPS.length) * 100}%` }}
                            initial={{ width: 0 }}
                            animate={{ width: `${(step / STEPS.length) * 100}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                </div>

                {/* Form Content */}
                <AnimatePresence mode="wait">
                    {renderStepContent()}
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8">
                    {step > 1 && (
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setStep(step - 1)}
                            className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium"
                        >
                            Previous
                        </motion.button>
                    )}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => step < STEPS.length ? setStep(step + 1) : handleSubmit()}
                        disabled={isLoading}
                        className="gradient-button px-6 py-2 text-white rounded-lg font-medium flex items-center gap-2"
                    >
                        {isLoading ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : (
                            <>
                                {step === STEPS.length ? 'Complete Profile' : 'Next'}
                            </>
                        )}
                    </motion.button>
                </div>
            </div>
        </div>
    );
};

const ExperienceSection = ({ title, icon, hasItems, items, type, onToggle, onAdd, onDelete, onUpdate }) => (
    <div className="glass-card p-6 rounded-xl">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
                {icon}
                {title}
            </h3>
            <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Have {title.toLowerCase()}?</span>
                <label className="switch">
                    <input
                        type="checkbox"
                        checked={hasItems}
                        onChange={(e) => onToggle(e.target.checked)}
                    />
                    <span className="slider round"></span>
                </label>
            </div>
        </div>

        {hasItems && (
            <div className="space-y-4">
                {items.map((item, index) => (
                    <ActivityCard
                        key={index}
                        data={item}
                        type={type}
                        onDelete={() => onDelete(index)}
                        onChange={(updated) => onUpdate(index, updated)}
                    />
                ))}
                <AddButton onClick={onAdd} text={`Add ${title.slice(0, -1)}`} />
            </div>
        )}
    </div>
);

const AddButton = ({ onClick, text }) => (
    <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-all flex items-center justify-center gap-2"
    >
        <Plus size={20} />
        {text}
    </motion.button>
);

export default MenteeProfileForm;
