import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Sparkles, X, Eye, Zap } from 'lucide-react';
import { useUser } from "../../context/UserContext";
import { useTranslation } from "react-i18next";

const CareerRoadmapGenerator = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { user } = useUser();
  const NODE_API = import.meta.env.VITE_NODE_API;
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleGenerate = async () => {
    if (!inputValue.trim()) return;
    
    setIsGenerating(true);
    
    try {
      const response = await axios.post(`${NODE_API}/roadmaps/generate`, {
        userId:user?._id,
        position: inputValue
      });
      
      if (response.data && response.data._id) {
        console.log(response.data)
        navigate(`/roadmap/${response.data._id}`);
      } else {
        console.error('Failed to generate roadmap');
      }
    } catch (error) {
      console.error('Error generating roadmap:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setInputValue('');
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center p-4 sm:p-6">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 sm:-top-40 -right-20 sm:-right-40 w-40 sm:w-80 h-40 sm:h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-20 sm:-bottom-40 -left-20 sm:-left-40 w-40 sm:w-80 h-40 sm:h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 sm:w-80 h-40 sm:h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-500"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center w-full max-w-lg mx-auto">
        {/* Roadmap Image Container */}
        <div className="mb-6 sm:mb-8 relative">
          <div className="relative mx-auto w-60 sm:w-80 h-48 sm:h-64 bg-white/10 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-2xl border border-white/20">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-2xl sm:rounded-3xl"></div>
            <div className="relative z-10 flex items-center justify-center h-full">
              <img 
                src="/roadmap.png" 
                alt="Career Roadmap" 
                className="max-w-full max-h-full object-contain drop-shadow-2xl"
              />
            </div>
          </div>
          
          {/* Floating Elements */}
          <div className="absolute -top-2 sm:-top-4 -right-2 sm:-right-4 w-6 sm:w-8 h-6 sm:h-8 bg-yellow-400 rounded-full animate-bounce delay-300"></div>
          <div className="absolute -bottom-2 sm:-bottom-4 -left-2 sm:-left-4 w-4 sm:w-6 h-4 sm:h-6 bg-pink-400 rounded-full animate-bounce delay-700"></div>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-6xl p-3 sm:p-5 font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-200 to-purple-200 mb-8 sm:mb-12 tracking-tight">
          {t("learningpath.title")} 
        </h1>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center px-4">
          <button
            onClick={() => setIsDialogOpen(true)}
            className="cursor-pointer group relative px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-base sm:text-lg rounded-xl sm:rounded-2xl shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300 hover:from-purple-500 hover:to-pink-500 w-full sm:w-auto"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl sm:rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
            <div className="relative flex items-center justify-center gap-2 sm:gap-3">
              <Zap className="w-5 sm:w-6 h-5 sm:h-6" />
              {t("learningpath.generate")} 
            </div>
          </button>

          <button 
            onClick={() => navigate(`/display-roadmaps`)} 
            className="cursor-pointer group relative px-6 sm:px-8 py-3 sm:py-4 bg-white/10 backdrop-blur-sm text-white font-bold text-base sm:text-lg rounded-xl sm:rounded-2xl border border-white/30 shadow-2xl hover:bg-white/20 transform hover:scale-105 transition-all duration-300 w-full sm:w-auto"
          >
            <div className="relative flex items-center justify-center gap-2 sm:gap-3">
              <Eye className="w-5 sm:w-6 h-5 sm:h-6" />
              {t("learningpath.view")} 
            </div>
          </button>
        </div>
      </div>

      {/* Dialog Overlay */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 w-full max-w-sm sm:max-w-md shadow-2xl border border-white/20">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl sm:rounded-3xl"></div>
            
            {/* Close Button */}
            <button
              onClick={closeDialog}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 text-white/70 hover:text-white transition-colors"
            >
              <X className="w-5 sm:w-6 h-5 sm:h-6" />
            </button>

            {/* Dialog Content */}
            <div className="relative z-10">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 text-center">
                {t("learningpath.generateRoadmap")}
              </h2>
              <p className="text-sm sm:text-base text-white/80 text-center mb-6">
                {t("learningpath.position")}
              </p>

              {/* Input Field */}
              <div className="mb-6">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={t("learningpath.placeholder")}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all text-sm sm:text-base"
                  disabled={isGenerating}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  onClick={closeDialog}
                  disabled={isGenerating}
                  className="w-full sm:flex-1 px-4 sm:px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-semibold rounded-xl text-sm sm:text-base hover:bg-white/20 transition-all disabled:opacity-50"
                >
                  {t("learningpath.cancel")}
                </button>
                
                <button
                  onClick={handleGenerate}
                  disabled={!inputValue.trim() || isGenerating}
                  className="cursor-pointer w-full sm:flex-1 px-4 sm:px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl text-sm sm:text-base hover:from-purple-500 hover:to-pink-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Sparkles 
                    className={`w-4 sm:w-5 h-4 sm:h-5 ${isGenerating ? 'animate-spin' : ''}`} 
                  />
                  {isGenerating ? t('learningpath.generating') : t('learningpath.generate')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CareerRoadmapGenerator;