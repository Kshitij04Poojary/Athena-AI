import React from 'react';
import { useTranslation } from "react-i18next";

const PreviewStep = ({ courseLayout }) => {
  const { t } = useTranslation();

  if (!courseLayout || Object.keys(courseLayout).length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">{t("createCourse.preview.loading")}</p>
      </div>
    );
  }

  const course = courseLayout;

  return (
    <div className="space-y-4 sm:space-y-6">
      <h3 className="text-2xl sm:text-3xl font-bold text-purple-700">{course["Course Name"]}</h3>
      
      <div className="bg-purple-50 p-4 sm:p-6 rounded-xl border border-purple-100">
        <p className="text-gray-700 mb-3 sm:mb-4 text-sm sm:text-base">
          <strong>{t("createCourse.preview.description")}:</strong> {course.Description}
        </p>
        
        <div className="mb-3 sm:mb-4">
          <strong className="block mb-1 sm:mb-2 text-sm sm:text-base">{t("createCourse.preview.skills")}:</strong>
          <div className="flex flex-wrap gap-2">
            {course.Skills.map((skill, skillIdx) => (
              <span 
                key={skillIdx} 
                className="bg-purple-200 px-2 sm:px-3 py-1 rounded-full text-purple-800 text-xs sm:text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-gray-700">
          <p><strong>{t("createCourse.preview.level")}:</strong> {course.Level}</p>
          <p><strong>{t("createCourse.preview.duration")}:</strong> {course.Duration}</p>
          <p><strong>{t("createCourse.preview.chapters")}:</strong> {course.NoOfChapters}</p>
        </div>
        
        <div className="mt-3 sm:mt-4">
          <strong className="block mb-1 sm:mb-2 text-sm sm:text-base">{t("createCourse.preview.outcomes")}:</strong>
          <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm">
            {course["Course Outcomes"].map((outcome, outcomeIdx) => (
              <li key={outcomeIdx} className="text-gray-700">{outcome}</li>
            ))}
          </ul>
        </div>
      </div>
      
      <div>
        <h4 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-purple-700">
          {t("createCourse.preview.chaptersTitle")}
        </h4>
        {course.Chapters.map((chapter, chapterIdx) => (
          <div 
            key={chapterIdx} 
            className="bg-white border border-purple-100 rounded-xl p-3 sm:p-5 mb-3 sm:mb-4 shadow-sm hover:shadow-md transition"
          >
            <h5 className="text-lg sm:text-xl font-semibold text-purple-600 mb-2">{chapter["Chapter Name"]}</h5>
            <p className="text-gray-600 mb-2 sm:mb-3 text-sm sm:text-base">{chapter.About}</p>
            <p className="mb-2 text-xs sm:text-sm">
              <strong>{t("createCourse.preview.chapterDuration")}:</strong> {chapter.Duration}
            </p>
            <div>
              <strong className="block mb-1 sm:mb-2 text-xs sm:text-sm">{t("createCourse.preview.content")}:</strong>
              <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm">
                {chapter.Content.map((item, contentIdx) => (
                  <li key={contentIdx} className="text-gray-700">{item}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PreviewStep;