import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import ExamReview from "../../pages/Assessment/ExamReview";

const ResultScreen = ({ score, totalQuestions,userAnswers,quiz }) => {
  const navigate = useNavigate(); // Initialize navigate function
  const percentage = Math.round((score / totalQuestions) * 100);
  console.log("Quiz",quiz)
  const getResultMessage = () => {
    if (percentage >= 90) return "Excellent!";
    if (percentage >= 70) return "Good job!";
    if (percentage >= 50) return "Well done!";
    return "Keep practicing!";
  };
  
  const getResultEmoji = () => {
    if (percentage >= 90) return "🏆";
    if (percentage >= 70) return "🎉";
    if (percentage >= 50) return "👍";
    return "💪";
  };
  
  const getColorClass = () => {
    if (percentage >= 90) return "from-indigo-600 to-purple-600";
    if (percentage >= 70) return "from-blue-500 to-indigo-600";
    if (percentage >= 50) return "from-green-500 to-blue-500";
    return "from-yellow-500 to-red-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-6 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className={`bg-gradient-to-r ${getColorClass()} p-8 text-center text-white`}>
          <span className="text-6xl mb-4 block">{getResultEmoji()}</span>
          <h2 className="font-bold text-3xl mb-2">Quiz Results</h2>
          <p className="text-lg opacity-90">{getResultMessage()}</p>
        </div>
        
        <div className="p-8">
          <div className="flex items-center justify-center">
            <div className="relative w-40 h-40">
              {/* Circular progress background */}
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle 
                  cx="50" 
                  cy="50" 
                  r="45" 
                  fill="none" 
                  stroke="#EDF2F7" 
                  strokeWidth="10" 
                />
                {/* Circular progress bar */}
                <circle 
                  cx="50" 
                  cy="50" 
                  r="45" 
                  fill="none" 
                  stroke="url(#gradient)" 
                  strokeWidth="10" 
                  strokeLinecap="round"
                  strokeDasharray={`${percentage * 2.83}, 283`} 
                  strokeDashoffset="0" 
                  transform="rotate(-90 50 50)" 
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4F46E5" />
                    <stop offset="100%" stopColor="#9333EA" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-gray-800">{percentage}%</span>
                <span className="text-sm text-gray-500 mt-1">Score</span>
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-xl font-medium text-gray-700">
              You scored {score} out of {totalQuestions} questions
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Keep challenging yourself to improve your knowledge!
            </p>
          </div>
          
          <div className="mt-8 flex gap-8 justify-center">
            <button
              onClick={() => navigate("/assessment")} // Redirect to ExamDashboard
              className="cursor-pointer px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Back to Dashboard
            </button>
            <button
              onClick={() => navigate("/examreview", { state: { userAnswers, quiz } })} // Redirect to ExamDashboard
              className="cursor-pointer px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              ExamReview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultScreen;
