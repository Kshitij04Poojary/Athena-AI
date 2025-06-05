import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import RoadmapCanvas from './RoadmapCanvas';

const RoadmapContent = () => {
  const { roadmapid } = useParams();
  const navigate = useNavigate();
  const [roadmapMeta, setRoadmapMeta] = useState(); 
  const [roadmapData, setRoadmapData] = useState(); 
  const [isLoading, setIsLoading] = useState(true);

  const NODE_API = import.meta.env.VITE_NODE_API;

  const GetRoadmapDetails = async () => {
    try {
      setIsLoading(true);
      const result = await axios.get(`${NODE_API}/roadmaps/${roadmapid}`);
      console.log(result.data);
      setRoadmapMeta({
        promptInput: result.data.promptInput,
        createdAt: result.data.createdAt
      });
      setRoadmapData(result.data.roadmapData);
    } catch (error) {
      console.error("Error fetching roadmap details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNewRoadmap = () => {
    navigate('/roadmap'); 
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  useEffect(() => {
    if (roadmapid) {
      GetRoadmapDetails();
    }
  }, [roadmapid]);

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-screen bg-gradient-to-br from-slate-50 to-blue-50'>
        <div className='flex flex-col items-center gap-4'>
          <div className='w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin'></div>
          <p className='text-slate-600 font-medium'>Loading your roadmap...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20'>
      <div className='px-6 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8 h-screen max-w-7xl mx-auto'>
        {/* Sidebar */}
        <div className='lg:col-span-1 space-y-6'>
          {/* Main Info Card */}
          <div className='bg-white/70 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300'>
            <div className='flex items-start gap-3 mb-4'>
              <div className='p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg'>
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <div className='flex-1'>
                <h2 className='text-xl font-bold text-slate-800 leading-tight'>
                  {roadmapData?.roadmapTitle}
                </h2>
                <p className='text-sm text-slate-500 mt-1'>
                  Created {roadmapMeta?.createdAt && formatDate(roadmapMeta.createdAt)}
                </p>
              </div>
            </div>
            
            <div className='space-y-4'>
              <div>
                <h3 className='font-semibold text-slate-700 mb-2'>Description</h3>
                <p className='text-sm text-slate-600 leading-relaxed bg-slate-50/50 rounded-lg p-3'>
                  {roadmapData?.description}
                </p>
              </div>
              
              <div className='flex items-center gap-2 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg'>
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className='font-semibold text-blue-700'>Duration: {roadmapData?.duration}</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button 
            onClick={handleCreateNewRoadmap}
            className='w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3'
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Another Roadmap
          </button>

          {/* Stats Card */}
          <div className='bg-white/70 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-6 shadow-lg'>
            <h3 className='font-semibold text-slate-700 mb-3'>Roadmap Stats</h3>
            <div className='space-y-3'>
              <div className='flex justify-between items-center'>
                <span className='text-sm text-slate-600'>Total Steps</span>
                <span className='font-semibold text-slate-800'>{roadmapData?.initialNodes?.length || 0}</span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-sm text-slate-600'>Connections</span>
                <span className='font-semibold text-slate-800'>{roadmapData?.initialEdges?.length || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Canvas Area */}
        <div className='lg:col-span-3 bg-white/50 backdrop-blur-sm border border-slate-200/50 rounded-2xl shadow-lg overflow-hidden'>
          <div className='h-full p-2'>
            <RoadmapCanvas initialNodes={roadmapData?.initialNodes} initialEdges={roadmapData?.initialEdges}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadmapContent;