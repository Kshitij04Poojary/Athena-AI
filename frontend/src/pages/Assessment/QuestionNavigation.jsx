import React from "react";

const QuestionNavigation = ({ 
  totalQuestions, 
  currentQuestion, 
  answeredQuestions, 
  onQuestionClick 
}) => {
  return (
    <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-3 gap-2 " >
      {Array.from({ length: totalQuestions }).map((_, index) => {
        // Determine the status of this question
        const isActive = currentQuestion === index;
        const isAnswered = answeredQuestions[index] !== undefined;
        
        return (
            <button
            key={index}
            onClick={() => onQuestionClick(index)}
            className={`group relative w-10 h-10 flex items-center justify-center rounded-lg font-semibold text-sm transition-all duration-300 ${
              isActive
                ? "bg-indigo-600 font-bold border border-indigo-400 shadow-lg" 
                : isAnswered
                ? "bg-green-700 text-indigo-600 border border-indigo-900"
                : "bg-green-800 text-gray-600 border border-gray-700 hover:border-indigo-800 hover:text-indigo-300"
            }`}
          >
            {index + 1}
            {isAnswered && !isActive && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-900"></span>
            )}
          </button>
          
        );
      })}
    </div>
  );
};

export default QuestionNavigation;