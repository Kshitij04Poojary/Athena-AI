import React, { useState } from 'react';
import { useTranslation } from "react-i18next";
import skillList from "../../data/skillList";

const SkillsStep = ({ skills, setSkills }) => {
  const { t } = useTranslation();
  const [skillInput, setSkillInput] = useState("");

  const addSkill = () => {
    const trimmedSkill = skillInput.trim();
    if (trimmedSkill && !skills.includes(trimmedSkill)) {
      setSkills([...skills, trimmedSkill]);
      setSkillInput("");
    }
  };

  const removeSkill = (skill) => setSkills(skills.filter((s) => s !== skill));

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl sm:text-2xl font-bold text-purple-800 mb-3 sm:mb-4">
        {t("createCourse.skills.title")}
      </h3>
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
        <input
          type="text"
          placeholder={t("createCourse.skills.addPlaceholder")}
          className="flex-grow p-2 sm:p-3 border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
          value={skillInput}
          onChange={(e) => setSkillInput(e.target.value)}
          onKeyPress={handleKeyPress}
          list="skillSuggestions"
        />
        <button
          className="bg-purple-600 text-white p-2 sm:p-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 transition duration-300"
          disabled={!skillInput.trim()}
          onClick={addSkill}
        >
          {t("createCourse.skills.addButton")}
        </button>
      </div>
      <datalist id="skillSuggestions">
        {skillList.filter(skill => skill.toLowerCase().includes(skillInput.toLowerCase())).map(skill => (
          <option key={skill} value={skill} />
        ))}
      </datalist>
      <div className="flex flex-wrap gap-2 mt-4">
        {skills.map(skill => (
          <div 
            key={skill} 
            className="bg-purple-200 px-3 py-1 rounded-full flex items-center space-x-2 text-purple-800"
          >
            <span className="text-sm sm:text-base">{skill}</span>
            <button 
              className="text-red-500 hover:text-red-700 transition" 
              onClick={() => removeSkill(skill)}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillsStep;