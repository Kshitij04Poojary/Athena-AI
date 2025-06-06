import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronUp, ChevronDown, Plus } from 'lucide-react';
import ActivityCard from './ActivityCard';

const ExperienceSection = ({ 
    title, 
    icon, 
    hasItems, 
    items, 
    type, 
    onToggle, 
    onAdd, 
    onDelete, 
    onUpdate,
    fields 
}) => {
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-gradient-to-b from-white/90 to-white/70 backdrop-blur-md border border-white/30 
            shadow-[0_10px_30px_rgba(0,0,0,0.06)] p-6 rounded-2xl overflow-hidden"
        >
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-5 gap-3">
                <h3 className="text-xl font-semibold flex items-center gap-3 text-gray-800">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-50 to-indigo-100 text-indigo-600">
                        {icon}
                    </div>
                    <p className="md:text-xl text-md">{title}</p>
                </h3>

                <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
                    <span className="text-sm font-medium text-gray-500">
                        Include {title.toLowerCase()}?
                    </span>

                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={hasItems}
                            onChange={(e) => onToggle(e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 
                        peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full 
                        peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] 
                        after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full 
                        after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r 
                        from-indigo-500 to-purple-500 shadow-sm"
                        ></div>
                    </label>

                    {hasItems && items.length > 0 && (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500"
                        >
                            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </motion.button>
                    )}
                </div>
            </div>

            {hasItems && (
                <motion.div
                    animate={{ height: isExpanded ? "auto" : 0, opacity: isExpanded ? 1 : 0 }}
                    className="space-y-4 overflow-hidden"
                >
                    {items.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                            <ActivityCard
                                data={item}
                                type={type}
                                onDelete={() => onDelete(index)}
                                onChange={(updated) => onUpdate(index, updated)}
                                fields={fields}
                            />
                        </motion.div>
                    ))}

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: items.length * 0.1 }}
                    >
                        <AddButton onClick={onAdd} text={`Add ${title.slice(0, -1)}`} />
                    </motion.div>
                </motion.div>
            )}
        </motion.div>
    );
};

const AddButton = ({ onClick, text }) => (
    <motion.button
        whileHover={{
            scale: 1.02,
            boxShadow: "0 4px 12px rgba(79, 70, 229, 0.15)",
            borderColor: "rgba(99, 102, 241, 0.8)"
        }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className="w-full p-4 border-2 border-dashed border-gray-200 rounded-xl text-indigo-600 
        hover:border-indigo-400 transition-all flex items-center justify-center gap-2 
        bg-gradient-to-r from-indigo-50/50 to-purple-50/50 hover:from-indigo-100/80 
        hover:to-purple-100/80 font-medium mt-4"
    >
        <div className="p-1 rounded-full bg-indigo-100">
            <Plus size={18} />
        </div>
        {text}
    </motion.button>
);

export default ExperienceSection;