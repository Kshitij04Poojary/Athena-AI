import { motion } from 'framer-motion';
import { School, Bookmark } from 'lucide-react';

const AcademicForm = ({ formData, updateFormData, errors }) => {
    const updateAcademics = (section, field, value) => {
        updateFormData({
            academics: {
                ...formData.academics,
                [section]: {
                    ...formData.academics[section],
                    [field]: value
                }
            }
        });
    };

    return (
        <motion.div
            key="academics"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
        >
            <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-100 p-2 rounded-lg">
                    <School size={24} className="text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Academic Information
                </h2>
            </div>

            {/* Class 10 */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm font-bold">
                        10
                    </div>
                    Class 10 Education
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">School Name</label>
                        <input
                            type="text"
                            value={formData.academics.class10.school}
                            onChange={(e) => updateAcademics('class10', 'school', e.target.value)}
                            className="w-full p-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-300 outline-none md:text-md text-xs"
                            placeholder="Enter school name"
                        />
                        {errors.class10 && (
                            <p className="text-red-500 text-sm mt-1">{errors.class10}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Percentage</label>
                        <input
                            type="number"
                            value={formData.academics.class10.percentage}
                            onChange={(e) => updateAcademics('class10', 'percentage', e.target.value)}
                            className="w-full p-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-300 outline-none md:text-md text-xs"
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
                            onChange={(e) => updateAcademics('class10', 'yearOfCompletion', e.target.value)}
                            className="w-full p-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-300 outline-none md:text-md text-xs"
                            placeholder="Enter year"
                            min="2000"
                            max={new Date().getFullYear()}
                        />
                    </div>
                </div>
            </div>

            {/* Class 12 */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm font-bold">
                        12
                    </div>
                    Class 12 Education
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">School Name</label>
                        <input
                            type="text"
                            value={formData.academics.class12.school}
                            onChange={(e) => updateAcademics('class12', 'school', e.target.value)}
                            className="w-full p-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-300 outline-none md:text-md text-xs"
                            placeholder="Enter school name"
                        />
                        {errors.class12 && (
                            <p className="text-red-500 text-sm mt-1">{errors.class12}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Percentage</label>
                        <input
                            type="number"
                            value={formData.academics.class12.percentage}
                            onChange={(e) => updateAcademics('class12', 'percentage', e.target.value)}
                            className="w-full p-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-300 outline-none md:text-md text-xs"
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
                            onChange={(e) => updateAcademics('class12', 'yearOfCompletion', e.target.value)}
                            className="w-full p-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-300 outline-none md:text-md text-xs"
                            placeholder="Enter year"
                            min="2000"
                            max={new Date().getFullYear()}
                        />
                    </div>
                </div>
            </div>

            {/* Current Education */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                        <Bookmark size={14} />
                    </div>
                    Current Education
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Institution Name</label>
                        <input
                            type="text"
                            value={formData.academics.currentEducation.institution}
                            onChange={(e) => updateAcademics('currentEducation', 'institution', e.target.value)}
                            className="w-full p-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-300 outline-none md:text-md text-xs"
                            placeholder="Enter institution name"
                        />
                        {errors.currentEducation && (
                            <p className="text-red-500 text-sm mt-1">{errors.currentEducation}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                        <input
                            type="text"
                            value={formData.academics.currentEducation.course}
                            onChange={(e) => updateAcademics('currentEducation', 'course', e.target.value)}
                            className="w-full p-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-300 outline-none md:text-md text-xs"
                            placeholder="e.g., B.Tech, BCA"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                        <input
                            type="text"
                            value={formData.academics.currentEducation.specialization}
                            onChange={(e) => updateAcademics('currentEducation', 'specialization', e.target.value)}
                            className="w-full p-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-300 outline-none md:text-md text-xs"
                            placeholder="e.g., Computer Science"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Year of Study</label>
                        <select
                            value={formData.academics.currentEducation.yearOfStudy}
                            onChange={(e) => updateAcademics('currentEducation', 'yearOfStudy', e.target.value)}
                            className="w-full p-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-300 outline-none md:text-md text-xs"
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
                            onChange={(e) => updateAcademics('currentEducation', 'cgpa', e.target.value)}
                            className="w-full p-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-300 outline-none md:text-md text-xs"
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
};

export default AcademicForm;