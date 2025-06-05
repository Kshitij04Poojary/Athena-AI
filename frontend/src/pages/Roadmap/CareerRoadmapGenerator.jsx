import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Sparkles, X, Eye, Zap } from 'lucide-react';
import { useUser } from "../../context/UserContext";

const CareerRoadmapGenerator = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { user } = useUser();
  const NODE_API = import.meta.env.VITE_NODE_API;
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center p-6">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-500"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center">
        {/* Roadmap Image Container */}
        <div className="mb-8 relative">
          <div className="relative mx-auto w-80 h-64 bg-white/10 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-3xl"></div>
            <div className="relative z-10 flex items-center justify-center h-full">
              <img 
                src="/roadmap.png" 
                alt="Career Roadmap" 
                className="max-w-full max-h-full object-contain drop-shadow-2xl"
              />
            </div>
          </div>
          
          {/* Floating Elements */}
          <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full animate-bounce delay-300"></div>
          <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-pink-400 rounded-full animate-bounce delay-700"></div>
        </div>

        {/* Title */}
        <h1 className="text-6xl p-5 font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-200 to-purple-200 mb-12 tracking-tight">
          Learning Pathway Generator
        </h1>

        {/* Action Buttons */}
        <div className="flex gap-6 justify-center">
          <button
            onClick={() => setIsDialogOpen(true)}
            className="cursor-pointer group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300 hover:from-purple-500 hover:to-pink-500"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
            <div className="relative flex items-center gap-3">
              <Zap className="w-6 h-6" />
              Generate
            </div>
          </button>

          <button className="group relative px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold text-lg rounded-2xl border border-white/30 shadow-2xl hover:bg-white/20 transform hover:scale-105 transition-all duration-300">
            <div className="relative flex items-center gap-3">
              <Eye className="w-6 h-6" />
              View
            </div>
          </button>
        </div>
      </div>

      {/* Dialog Overlay */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full shadow-2xl border border-white/20">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-3xl"></div>
            
            {/* Close Button */}
            <button
              onClick={closeDialog}
              className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Dialog Content */}
            <div className="relative z-10 cursor-pointer ">
              <h2 className="text-2xl font-bold text-white mb-2 text-center">
                Generate Your Roadmap
              </h2>
              <p className="text-white/80 text-center mb-6">
                Enter the position/skills to Generate Roadmap
              </p>

              {/* Input Field */}
              <div className="mb-6">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="e.g., Frontend Developer, React Developer..."
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                  disabled={isGenerating}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={closeDialog}
                  disabled={isGenerating}
                  className="flex-1 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-semibold rounded-xl hover:bg-white/20 transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                
                <button
                  onClick={handleGenerate}
                  disabled={!inputValue.trim() || isGenerating}
                  className="cursor-pointer flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Sparkles 
                    className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} 
                  />
                  {isGenerating ? 'Generating...' : 'Generate'}
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