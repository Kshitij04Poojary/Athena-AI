import React from 'react';
import { useTranslation } from "react-i18next";

const TopicStep = ({ formData, setFormData }) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <h3 className="text-xl sm:text-2xl font-bold text-purple-800 mb-3 sm:mb-4">
        {t("createCourse.topic.title")}
      </h3>
      <input
        type="text"
        placeholder={t("createCourse.topic.topicPlaceholder")}
        className="w-full p-2 sm:p-3 border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
        value={formData.topic}
        onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
      />
      <textarea
        placeholder={t("createCourse.topic.descriptionPlaceholder")}
        className="w-full p-2 sm:p-3 border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
        rows="4"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
      />
    </div>
  );
};

export default TopicStep;