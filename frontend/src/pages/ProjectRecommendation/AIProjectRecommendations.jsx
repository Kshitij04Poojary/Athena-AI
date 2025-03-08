import React, { useState } from 'react';
import axios from 'axios';
import { useUser } from '../../context/UserContext';

const AIProjectRecommendations = () => {
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [projectRecommendations, setProjectRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  // Get unique domains for filtering
  const domains = ['All', ...new Set(projectRecommendations.map(project => project.domain))];

  // Filter projects based on selected domain
  const filteredProjects = selectedDomain === 'All'
    ? projectRecommendations
    : projectRecommendations.filter(project => project.domain === selectedDomain);

  async function fetchRecommendations() {
    if (!user) {
      console.error('User not logged in');
      return;
    }
    
    try {
      setLoading(true);
      const response = await axios.post(
        "http://127.0.0.1:5004/recommendations/",
        { "user_id": user._id },
        { withCredentials: true }
      );
      
      console.log(response.data.responses);
      const updatedData = response.data.responses.map(item => {
        return {
          ...item,
          domain: item.domain  // domain is already a string
        };
      });
      
      console.log(updatedData);
      setProjectRecommendations(updatedData);
    } catch (error) {
      console.error('Error fetching project recommendations:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">AI Project Recommendations</h1>
        <p className="text-gray-600 mb-4">Discover innovative project ideas powered by artificial intelligence</p>
        
        {/* Fetch Recommendations Button */}
        <div className="mb-6">
          <button
            onClick={fetchRecommendations}
            disabled={loading}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:bg-indigo-400 disabled:cursor-not-allowed flex items-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading Recommendations...
              </>
            ) : (
              <>Get AI Project Recommendations</>
            )}
          </button>
        </div>

        {/* Domain Filter - Only show if there are recommendations */}
        {projectRecommendations.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Filter by Domain</h2>
            <div className="flex flex-wrap gap-2">
              {domains.map(domain => (
                <button
                  key={domain}
                  onClick={() => setSelectedDomain(domain)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedDomain === domain
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {domain}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
            <p className="text-gray-600">Fetching personalized recommendations...</p>
          </div>
        ) : projectRecommendations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredProjects.map((project, index) => (
              <div
                key={project._id || index}
                className="bg-white rounded-xl p-6 shadow-sm transition-all duration-300 border border-gray-100 hover:shadow-md"
              >
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800">
                    {project.domain}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-3">{project.title}</h2>
                <p className="text-gray-600 mb-4 text-sm">{project.description}</p>

                <div className="mt-3">
                  <h3 className="text-sm font-semibold text-gray-900 my-2">Key Features</h3>
                  <ul className="space-y-4">
                    {project.key_features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-800 mr-2">
                          ✓
                        </span>
                        <span className="text-sm text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="text-gray-400 text-5xl mb-4">🤖</div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">No Recommendations Yet</h3>
            <p className="text-gray-600 mb-6">Click the button above to get personalized AI project recommendations.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIProjectRecommendations;