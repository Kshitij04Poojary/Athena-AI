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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="flex items-center space-x-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-400 border-t-transparent"></div>
          <span className="text-white text-xl font-medium">Loading your roadmaps...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Please log in</h2>
          <p className="text-gray-300">You need to be logged in to view your roadmaps.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-purple-400 mr-3" />
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Your Learning Roadmaps
            </h1>
          </div>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Embark on your journey to mastery with personalized learning paths crafted just for you.
          </p>
        </div>

        {roadmaps.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-24 h-24 text-gray-500 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-white mb-2">No roadmaps yet</h3>
            <p className="text-gray-400 mb-8">Create your first roadmap to get started on your learning journey!</p>
            <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
              Create Roadmap
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-8">
            {roadmaps.map((roadmap, index) => (
              <div
                key={roadmap._id}
                className="relative bg-[#1a1625] rounded-2xl overflow-hidden group"
              >
                {/* Card Content */}
                <div className="p-6 sm:p-8">
                  {/* Header with Icon */}
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-[#2d2640] rounded-xl flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-6 h-6 text-[#e879f9]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">
                        {roadmap.roadmapData.roadmapTitle}
                      </h3>
                      <div className="inline-block px-3 py-1 bg-[#2d2640] rounded-md">
                        <span className="text-sm text-gray-300">Learning Path</span>
                      </div>
                    </div>
                  </div>

                  {/* Description Section - Hidden on Mobile */}
                  <div className="hidden sm:block">
                    <p className="text-gray-300 text-base mb-6">
                      {roadmap.roadmapData.description}
                    </p>
                  </div>

                  {/* Time Information */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-[#e879f9]" />
                      <span className="text-white">{roadmap.roadmapData.duration}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-[#e879f9]" />
                      <span className="text-gray-300">{formatDate(roadmap.createdAt)}</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => handleViewRoadmap(roadmap._id)}
                    className="w-full bg-gradient-to-r from-[#9333ea] to-[#e879f9] hover:from-[#7e22ce] hover:to-[#d946ef] text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group/btn"
                  >
                    <span>Explore Roadmap</span>
                    <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-500/10 to-transparent rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-pink-500/10 to-transparent rounded-full blur-2xl"></div>
              </div>
            ))}
          </div>
        )}

        {/* Stats Section - Only visible on larger screens */}
        {roadmaps.length > 0 && (
          <div className="hidden sm:block mt-16 text-center">
            <div className="inline-flex items-center space-x-6 bg-slate-800/30 backdrop-blur-sm border border-slate-700/30 rounded-2xl px-8 py-4">
              <div>
                <span className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {roadmaps.length}
                </span>
                <p className="text-gray-400 text-sm">Learning Paths</p>
              </div>
              <div className="w-px h-8 bg-slate-700"></div>
              <div>
                <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  ∞
                </span>
                <p className="text-gray-400 text-sm">Possibilities</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoadmapDisplay;