import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, ArrowRight, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import AcademicForm from './AcademicForm';
import ExperienceForm from './ExperienceForm';
import GoalsForm from './GoalsForm';
import ProfileHeader from './ProfileHeader';

const ProfileForm = ({ initialData = {}, onComplete }) => {
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
    const [errors, setErrors] = useState({});

    const STEPS = [
        { id: 1, label: 'Academics', title: 'Academic Journey' },
        { id: 2, label: 'Experience', title: 'Professional Experience' },
        { id: 3, label: 'Goals', title: 'Career Aspirations' }
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
            await onComplete(formData);
            toast.success("Profile updated successfully!");
        } catch (err) {
            toast.error("Update failed");
        } finally {
            setIsLoading(false);
        }
    };

    const handleNext = () => {
        if (validateStep(step)) {
            setStep((prevStep) => Math.min(prevStep + 1, STEPS.length));
        }
    };

    const handlePrevious = () => {
        setStep((prevStep) => Math.max(prevStep - 1, 1));
    };

    const updateFormData = (newData) => {
        setFormData(prev => ({ ...prev, ...newData }));
    };

    const renderStepContent = () => {
        const commonProps = {
            formData,
            updateFormData,
            errors
        };

        switch (step) {
            case 1:
                return <AcademicForm {...commonProps} />;
            case 2:
                return <ExperienceForm {...commonProps} />;
            case 3:
                return <GoalsForm {...commonProps} />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-tr from-gray-50 via-blue-50 to-indigo-50 pt-8 pb-16">
            <div className="max-w-4xl mx-auto md:px-4">
                <ProfileHeader step={step} />

                {/* Form Content */}
                <div className="bg-white rounded-3xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl">
                    {/* Mobile Progress Indicator */}
                    <div className="flex items-center gap-2 mb-6 md:hidden">
                        {[1, 2, 3].map((stepNumber) => (
                            <div
                                key={stepNumber}
                                className={`h-1.5 rounded-full transition-all duration-300 ${
                                    stepNumber === step
                                        ? "bg-indigo-600 flex-grow"
                                        : stepNumber < step
                                        ? "bg-indigo-400 flex-grow"
                                        : "bg-gray-200 flex-grow"
                                }`}
                            />
                        ))}
                    </div>

                    {/* Step Title */}
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">
                        {STEPS[step - 1]?.title}
                    </h2>

                    {/* Dynamic Form Content */}
                    <div className="transition-all duration-500 animate-fadeIn">
                        {renderStepContent()}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between md:mt-10 pt-6 border-t border-gray-100">
                        <button
                            onClick={handlePrevious}
                            disabled={step === 1}
                            className={`flex items-center md:gap-2 gap-1 px-0 md:px-6 py-3 rounded-xl font-medium transition-all duration-300 md:text-xl text-xs ${
                                step === 1
                                    ? "text-gray-400 cursor-not-allowed"
                                    : "text-indigo-600 hover:bg-indigo-50"
                            }`}
                        >
                            <ArrowLeft size={18} />
                            Previous
                        </button>

                        <button
                            onClick={step === 3 ? handleSubmit : handleNext}
                            disabled={isLoading}
                            className="flex items-center md:gap-2 gap-1 md:px-8 px-1 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 md:text-lg text-xs disabled:opacity-50"
                        >
                            {isLoading ? 'Processing...' : step === 3 ? "Complete Profile" : "Continue"}
                            <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileForm;