import { motion } from 'framer-motion';
import { Briefcase, Award } from 'lucide-react';
import ExperienceSection from './ExperienceSection';

const ExperienceForm = ({ formData, updateFormData, errors }) => {
    const handleAddItem = (type) => {
        const newItems = {
            extracurricular: { activity: '', role: '', duration: '', description: '' },
            internships: { company: '', role: '', duration: '', description: '' },
            achievements: { title: '', year: new Date().getFullYear(), description: '' }
        };

        updateFormData({
            [type]: [...formData[type], newItems[type]]
        });
    };

    const handleDeleteItem = (type, index) => {
        updateFormData({
            [type]: formData[type].filter((_, i) => i !== index)
        });
    };

    const handleUpdateItem = (type, index, updatedItem) => {
        const newItems = [...formData[type]];
        newItems[index] = updatedItem;
        updateFormData({
            [type]: newItems
        });
    };

    const handleToggleSection = (type, checked) => {
        const toggleMap = {
            extracurricular: 'hasExtracurricular',
            internships: 'hasInternships',
            achievements: 'hasAchievements'
        };

        updateFormData({
            [toggleMap[type]]: checked,
            [type]: checked ? formData[type] : []
        });
    };

    return (
        <motion.div
            key="experience"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
        >
            <div className="flex items-center gap-3 mb-6">
                <div className="bg-indigo-100 p-2 rounded-lg">
                    <Briefcase size={24} className="text-indigo-600" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Experience & Activities
                </h2>
            </div>

            {/* Extracurricular Activities */}
            <ExperienceSection
                title="Extracurricular Activities"
                icon={<Award size={20} className="text-purple-500" />}
                hasItems={formData.hasExtracurricular}
                items={formData.extracurricular}
                type="extracurricular"
                onToggle={(checked) => handleToggleSection('extracurricular', checked)}
                onAdd={() => handleAddItem('extracurricular')}
                onDelete={(index) => handleDeleteItem('extracurricular', index)}
                onUpdate={(index, item) => handleUpdateItem('extracurricular', index, item)}
                fields={[
                    { name: 'activity', label: 'Activity Name', type: 'text' },
                    { name: 'role', label: 'Your Role', type: 'text' },
                    { name: 'duration', label: 'Duration', type: 'text' },
                    { name: 'description', label: 'Description', type: 'textarea' }
                ]}
            />

            {/* Internships */}
            <ExperienceSection
                title="Internships"
                icon={<Briefcase size={20} className="text-blue-500" />}
                hasItems={formData.hasInternships}
                items={formData.internships}
                type="internships"
                onToggle={(checked) => handleToggleSection('internships', checked)}
                onAdd={() => handleAddItem('internships')}
                onDelete={(index) => handleDeleteItem('internships', index)}
                onUpdate={(index, item) => handleUpdateItem('internships', index, item)}
                fields={[
                    { name: 'company', label: 'Company Name', type: 'text' },
                    { name: 'role', label: 'Your Role', type: 'text' },
                    { name: 'duration', label: 'Duration', type: 'text' },
                    { name: 'description', label: 'Description', type: 'textarea' }
                ]}
            />

            {/* Achievements */}
            <ExperienceSection
                title="Achievements"
                icon={<Award size={20} className="text-yellow-500" />}
                hasItems={formData.hasAchievements}
                items={formData.achievements}
                type="achievements"
                onToggle={(checked) => handleToggleSection('achievements', checked)}
                onAdd={() => handleAddItem('achievements')}
                onDelete={(index) => handleDeleteItem('achievements', index)}
                onUpdate={(index, item) => handleUpdateItem('achievements', index, item)}
                fields={[
                    { name: 'title', label: 'Achievement Title', type: 'text' },
                    { name: 'year', label: 'Year', type: 'number' },
                    { name: 'description', label: 'Description', type: 'textarea' }
                ]}
            />
        </motion.div>
    );
};

export default ExperienceForm;