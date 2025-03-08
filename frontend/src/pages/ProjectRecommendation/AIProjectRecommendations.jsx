import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '../../context/UserContext';

const AIProjectRecommendations = () => {
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [projectRecommendations, setProjectRecommendations] = useState([]);  // Initialize as empty array
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  // Get unique domains for filtering
  const domains = ['All', ...new Set(projectRecommendations.map(project => project.domain))];

  // Filter projects based on selected domain
  const filteredProjects = selectedDomain === 'All'
    ? projectRecommendations
    : projectRecommendations.filter(project => project.domain === selectedDomain);

  async function fetchData() {
    try {
      setLoading(true);
      const response = await axios.post("http://127.0.0.1:5004/recommendations/",
        { "user_id": user._id },
        { withCredentials: true }
      );
      console.log(response.data.responses);
      setProjectRecommendations(response.data.responses);
    } catch (error) {
      console.error('Error fetching project recommendations:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  return (
    <div className="bg-gray-50 min-h-screen p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">AI Project Recommendations</h1>
        <p className="text-gray-600 mb-8">Discover innovative project ideas powered by artificial intelligence</p>

        {/* Domain Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {domains.map(domain => (
              <button
                key={domain}
                onClick={() => setSelectedDomain(domain)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${selectedDomain === domain
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
              >
                {domain}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center text-gray-600">Loading recommendations...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredProjects.map((project, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm transition-all duration-300 border border-gray-100"
              >
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800">
                    {project.domain}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-3">{project.title}</h2>
                <p className="text-gray-600 mb-4 text-sm">{project.description}</p>

                <div className='mt-3'>
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
        )}
      </div>
    </div>
  );
};

export default AIProjectRecommendations;
