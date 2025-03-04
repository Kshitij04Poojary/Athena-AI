import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { 
  Clock, 
  BookOpen, 
  RefreshCw, 
  Target, 
  Sparkles,
  TrendingUp 
} from 'lucide-react';

const ExamDashboard = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  
  // State for generating new assessment
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  
  // State for past assessments
  const [assessments, setAssessments] = useState([]);
  const [isAssessmentsLoading, setIsAssessmentsLoading] = useState(false);

  // Fetch user assessments
  const fetchAssessments = async () => {
    if (!user?._id) return;

    setIsAssessmentsLoading(true);
    try {
      const res = await axios.get(`http://localhost:8000/api/assessment/getassess/${user._id}`);
      setAssessments(res.data);
    } catch (error) {
      console.error('Error fetching assessments', error);
    } finally {
      setIsAssessmentsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessments();
  }, [user?._id]);

  // Generate new assessment
  const generateAssessment = async () => {
    if (!topic.trim()) {
      alert('Please enter a topic.');
      return;
    }
    
    setLoading(true);
    try {           
      const res = await axios.post('http://localhost:8000/api/assessment/generate', {
        userId: user?._id,
        topic
      });
      const examId = res.data._id;
      navigate(`/assessment/${examId}`);
    } catch (error) {
      console.error('Error generating assessment', error);
    } finally {
      setLoading(false);
      fetchAssessments(); // Refresh assessments list
    }
  };

  // Reattempt assessment
  const reattemptAssessment = (examId) => {
    navigate(`/assessment/${examId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
        {/* Assessment Generation Section */}
        <div className="md:col-span-1 bg-white rounded-2xl shadow-2xl border border-blue-50 p-8 transform transition-all hover:scale-105 hover:shadow-3xl">
          <div className="text-center mb-6">
            <div className="inline-block bg-blue-100 p-3 rounded-full mb-4">
              <Target className="text-blue-600" size={32} />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Generate Test</h2>
            <p className="text-gray-500">Create a personalized assessment</p>
          </div>
          <div className="space-y-4">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter a topic (e.g., React, Machine Learning)"
              className="w-full p-4 border-2 border-blue-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all placeholder-gray-400"
              disabled={loading}
            />
            <button
              onClick={generateAssessment}
              className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl font-bold hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 flex items-center justify-center space-x-2 group cursor-pointer"
              disabled={loading}
            >
              {loading ? (
                <svg className="animate-spin h-6 w-6 mr-2 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l4-4-4-4v4a8 8 0 00-8 8h4z"></path>
                </svg>
              ) : (
                <>
                  <Sparkles className="group-hover:rotate-45 transition-transform" size={24} />
                  <span>Generate New Assessment</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Past Assessments Section */}
        <div className="md:col-span-2 bg-white rounded-2xl shadow-2xl border border-blue-50 p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <div className="inline-block bg-blue-100 p-3 rounded-full mb-2">
                <BookOpen className="text-blue-600" size={32} />
              </div>
              <h2 className="text-3xl font-bold text-gray-800">Your Assessments</h2>
              <p className="text-gray-500">Track your learning progress</p>
            </div>
            {assessments.length > 0 && (
              <div className="flex items-center text-blue-600 font-semibold">
                <TrendingUp className="mr-2" size={24} />
                {assessments.length} Total Tests
              </div>
            )}
          </div>
          
          {isAssessmentsLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-pulse">
                <svg className="h-16 w-16 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
            </div>
          ) : assessments.length === 0 ? (
            <div className="text-center bg-blue-50 rounded-xl p-10">
              <div className="inline-block bg-blue-100 p-4 rounded-full mb-4">
                <BookOpen className="text-blue-600" size={32} />
              </div>
              <p className="text-xl text-gray-700 mb-2">No assessments yet</p>
              <p className="text-gray-500">Start your learning journey by generating a test!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {assessments.map((assessment) => (
                <div 
                  key={assessment._id} 
                  className="bg-blue-50 rounded-xl p-5 flex items-center justify-between hover:bg-blue-100 transition-colors group"
                >
                  <div>
                    <h3 className="font-bold text-xl text-gray-800 mb-1">{assessment.topic}</h3>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="mr-2" size={16} />
                      {new Date(assessment.createdAt).toLocaleDateString()}
                      <span className="ml-4 bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full">
                        Score: {assessment.score}%
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => reattemptAssessment(assessment._id)}
                    className="px-5 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center group-hover:translate-x-1 transition-transform cursor-pointer"
                  >
                    <RefreshCw className="mr-2" size={16} />
                    Reattempt Test
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExamDashboard;