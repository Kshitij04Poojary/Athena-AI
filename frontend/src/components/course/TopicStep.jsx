import React from 'react';
import { useTranslation } from "react-i18next";

const TopicStep = ({ formData, setFormData }) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <h3 className="text-xl sm:text-2xl font-bold text-blue-700 mb-3 sm:mb-4">
        {t("createCourse.topic.title")}
      </h3>

      <input
        type="text"
        placeholder={t("createCourse.topic.topicPlaceholder")}
        className="w-full p-3 sm:p-4 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 text-gray-800 shadow-sm"
        value={formData.topic}
        onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
      />

      <textarea
        placeholder={t("createCourse.topic.descriptionPlaceholder")}
        className="w-full p-3 sm:p-4 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 text-gray-800 shadow-sm"
        rows="4"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
      />
    </div>
  );
};

export default TopicStep;
