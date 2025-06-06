import { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Briefcase, Plus, X } from 'lucide-react';

const GoalsForm = ({ formData, updateFormData, errors }) => {
    const [newDreamCompany, setNewDreamCompany] = useState('');

    const handleAddDreamCompany = () => {
        if (newDreamCompany && !formData.futureGoals.dreamCompanies.includes(newDreamCompany)) {
            updateFormData({
                futureGoals: {
                    ...formData.futureGoals,
                    dreamCompanies: [...formData.futureGoals.dreamCompanies, newDreamCompany]
                }
            });
            setNewDreamCompany('');
        }
    };

    const handleRemoveDreamCompany = (index) => {
        updateFormData({
            futureGoals: {
                ...formData.futureGoals,
                dreamCompanies: formData.futureGoals.dreamCompanies.filter((_, i) => i !== index)
            }
        });
    };

    const handleGoalChange = (field, value) => {
        updateFormData({
            futureGoals: {
                ...formData.futureGoals,
                [field]: value
            }
        });
    };

    return (
        <motion.div
            key="goals"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
        >
            <div className="flex items-center gap-3 mb-6">
                <div className="bg-purple-100 p-2 rounded-lg">
                    <Target size={24} className="text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Future Goals
                </h2>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
                {/* Short Term Goals */}
                <div className="mb-6">
                    <label className="flex items-center gap-2 text-lg font-medium text-gray-800 mb-3">
                        <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                            <Target size={14} />
                        </div>
                        Short Term Goals
                        <span className="text-sm font-normal text-gray-500">(Next 1-2 years)</span>
                    </label>
                    <textarea
                        value={formData.futureGoals.shortTerm}
                        onChange={(e) => handleGoalChange('shortTerm', e.target.value)}
                        className="w-full p-4 rounded-lg min-h-[120px] bg-gray-50 border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all duration-300 outline-none md:text-md text-sm"
                        placeholder="Describe your short term goals..."
                    />
                    {errors.shortTerm && (
                        <p className="text-red-500 text-sm mt-1">{errors.shortTerm}</p>
                    )}
                </div>

                {/* Long Term Goals */}
                <div className="mb-6">
                    <label className="flex items-center gap-2 text-lg font-medium text-gray-800 mb-3">
                        <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                            <Target size={14} />
                        </div>
                        Long Term Goals
                        <span className="text-sm font-normal text-gray-500">(5+ years)</span>
                    </label>
                    <textarea
                        value={formData.futureGoals.longTerm}
                        onChange={(e) => handleGoalChange('longTerm', e.target.value)}
                        className="w-full p-4 rounded-lg min-h-[120px] bg-gray-50 border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all duration-300 outline-none md:text-md text-sm"
                        placeholder="Describe your long term goals..."
                    />
                    {errors.longTerm && (
                        <p className="text-red-500 text-sm mt-1">{errors.longTerm}</p>
                    )}
                </div>

                {/* Dream Companies */}
                <div>
                    <label className="flex items-center gap-2 text-lg font-medium text-gray-800 mb-3">
                        <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                            <Briefcase size={14} />
                        </div>
                        Dream Companies
                    </label>

                    <div className="flex flex-wrap gap-2 mb-4">
                        {formData.futureGoals.dreamCompanies.map((company, index) => (
                            <motion.div
                                key={index}
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 px-4 py-2 rounded-full flex items-center gap-2 shadow-sm md:text-md text-xs"
                            >
                                {company}
                                <button
                                    onClick={() => handleRemoveDreamCompany(index)}
                                    className="hover:text-red-500 transition-colors duration-200"
                                >
                                    <X size={16} />
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
                            className="flex-1 md:text-md text-xs md:p-3 pl-1 rounded-lg bg-gray-50 border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all duration-300 outline-none w-3/4"
                            placeholder="Add a dream company"
                        />
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleAddDreamCompany}
                            className="p-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md transition-all duration-300 hover:shadow-lg"
                        >
                            <Plus size={20} />
                        </motion.button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default GoalsForm;