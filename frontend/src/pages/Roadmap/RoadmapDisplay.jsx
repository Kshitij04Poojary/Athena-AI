import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, Sparkles, BookOpen, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { useUser } from "../../context/UserContext";

const RoadmapDisplay = () => {
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useUser();
  const NODE_API = import.meta.env.VITE_NODE_API;
   const navigate = useNavigate();

  useEffect(() => {
    const fetchRoadmaps = async () => {
      if (!user?._id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);        
        const response = await axios.get(`${NODE_API}/roadmaps/user/${user._id}`);
        setRoadmaps(response.data);
      } catch (err) {
        console.error('Error fetching roadmaps:', err);
        setError('Failed to load roadmaps. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmaps();
  }, [user?._id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleViewRoadmap = (roadmapId) => {
    navigate(`/roadmap/${roadmapId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-purple-400 border-t-transparent"></div>
          <span className="text-white text-lg sm:text-xl font-medium text-center">Loading your roadmaps...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-300 mb-6 text-sm sm:text-base">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 sm:px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors w-full sm:w-auto"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 text-purple-400 mx-auto mb-4" />
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Please log in</h2>
          <p className="text-gray-300 text-sm sm:text-base">You need to be logged in to view your roadmaps.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400 mr-2 sm:mr-3" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent p-2 sm:p-3">
              Your Learning Roadmaps
            </h1>
          </div>
          <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto px-4">
            Embark on your journey to mastery with personalized learning paths crafted just for you.
          </p>
        </div>

        {/* Roadmaps Grid */}
        {roadmaps.length === 0 ? (
          <div className="text-center py-12 sm:py-20 px-4">
            <BookOpen className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 text-gray-500 mx-auto mb-6" />
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">No roadmaps yet</h3>
            <p className="text-gray-400 mb-6 sm:mb-8 text-sm sm:text-base">Create your first roadmap to get started on your learning journey!</p>
            <button className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold text-base sm:text-lg transition-all duration-300 transform hover:scale-105 shadow-lg w-full sm:w-auto">
              Create Roadmap
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {roadmaps.map((roadmap, index) => (
              <div
                key={roadmap._id}
                className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4 sm:p-6 lg:p-8 hover:border-purple-500/50 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-600/5 to-pink-600/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4 sm:mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-purple-300 transition-colors leading-tight">
                          {roadmap.roadmapData.roadmapTitle}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-400">Learning Path</p>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-300 text-sm mb-4 sm:mb-6 line-clamp-2 sm:line-clamp-3 leading-relaxed">
                    {roadmap.roadmapData.description}
                  </p>

                  {/* Details */}
                  <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                    <div className="flex items-center space-x-3">
                      <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 flex-shrink-0" />
                      <span className="text-white font-medium text-sm sm:text-base">{roadmap.roadmapData.duration}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-pink-400 flex-shrink-0" />
                      <span className="text-gray-300 text-sm sm:text-base">{formatDate(roadmap.createdAt)}</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => handleViewRoadmap(roadmap._id)}
                    className="cursor-pointer w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 group/btn shadow-lg hover:shadow-purple-500/25 text-sm sm:text-base"
                  >
                    <span>Explore Roadmap</span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-4 right-4 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute bottom-4 left-4 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              </div>
            ))}
          </div>
        )}

        {/* Footer stats */}
        {roadmaps.length > 0 && (
          <div className="mt-12 sm:mt-16 text-center px-4">
            <div className="inline-flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 bg-slate-800/30 backdrop-blur-sm border border-slate-700/30 rounded-2xl px-6 sm:px-8 py-4 w-full sm:w-auto max-w-sm sm:max-w-none">
              <div>
                <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {roadmaps.length}
                </span>
                <p className="text-gray-400 text-xs sm:text-sm">Learning Paths</p>
              </div>
              <div className="w-full h-px sm:w-px sm:h-8 bg-slate-700"></div>
              <div>
                <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  ∞
                </span>
                <p className="text-gray-400 text-xs sm:text-sm">Possibilities</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoadmapDisplay;