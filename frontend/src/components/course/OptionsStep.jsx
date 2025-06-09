import React from 'react';
import { useTranslation } from "react-i18next";

const OptionsStep = ({ formData, setFormData }) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <h3 className="text-xl sm:text-2xl font-bold text-blue-800 mb-3 sm:mb-4">
        {t("createCourse.options.title")}
      </h3>

      <select
        className="w-full p-2 sm:p-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
        value={formData.difficulty}
        onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
      >
        <option value="">{t("createCourse.options.difficultyPlaceholder")}</option>
        <option>{t("createCourse.options.difficulty.basic")}</option>
        <option>{t("createCourse.options.difficulty.intermediate")}</option>
        <option>{t("createCourse.options.difficulty.advanced")}</option>
      </select>

      <input
        type="text"
        placeholder={t("createCourse.options.durationPlaceholder")}
        className="w-full p-2 sm:p-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
        value={formData.duration}
        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
      />

      <input
        type="number"
        placeholder={t("createCourse.options.chaptersPlaceholder")}
        className="w-full p-2 sm:p-3 border-2 border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
        value={formData.noOfChp}
        min={1}
        max={5}
        onChange={(e) => setFormData({ ...formData, noOfChp: Number(e.target.value) })}
      />
    </div>
  );
};

export default OptionsStep;