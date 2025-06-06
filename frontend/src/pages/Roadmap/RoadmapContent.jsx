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

  const handleBackNavigation = () => {
    navigate('/display-roadmaps');
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
    <div className='mb-65 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20'>
      {/* Back Navigation */}
      <div className='px-6 pt-6'>
        <button 
          onClick={handleBackNavigation}
          className='cursor-pointer flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors duration-200 group'
        >
          <svg 
            className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-200" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className='font-medium'>Back to Roadmaps</span>
        </button>
      </div>

      <div className='px-6 py-4 grid grid-cols-1 lg:grid-cols-4 gap-8 h-screen max-w-7xl mx-auto'>
        {/* Sidebar */}
        <div className='lg:col-span-1 space-y-6'>
          {/* Main Info Card */}
          <div className='bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white/90'>
            <div className='flex items-start gap-4 mb-6'>
              <div className='p-3 bg-blue-500 rounded-xl shadow-md'>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <div className='flex-1'>
                <h2 className='text-xl font-bold text-slate-800 leading-tight mb-1'>
                  {roadmapData?.roadmapTitle}
                </h2>
                <div className='flex items-center gap-2 text-sm text-slate-500'>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Created {roadmapMeta?.createdAt && formatDate(roadmapMeta.createdAt)}</span>
                </div>
              </div>
            </div>
            
            <div className='space-y-5'>
              <div>
                <h3 className='font-semibold text-slate-700 mb-3 flex items-center gap-2'>
                  <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                  Description
                </h3>
                <p className='text-sm text-slate-600 leading-relaxed bg-slate-50 rounded-xl p-4 border border-slate-100'>
                  {roadmapData?.description}
                </p>
              </div>
              
              <div className='flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100'>
                <div className='p-2 bg-blue-500 rounded-lg'>
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <span className='text-xs font-medium text-blue-600 uppercase tracking-wide'>Duration</span>
                  <p className='font-semibold text-blue-800'>{roadmapData?.duration}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button 
            onClick={handleCreateNewRoadmap}
            className='cursor-pointer w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3'
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Another Roadmap
          </button>

          {/* Stats Card */}
          <div className='bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white/90'>
            <div className='flex items-center gap-3 mb-4'>
              <div className='p-2 bg-slate-100 rounded-lg'>
                <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className='font-semibold text-slate-700'>Roadmap Overview</h3>
            </div>
            <div className='space-y-4'>
              <div className='flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100'>
                <div className='flex items-center gap-2'>
                  <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
                  <span className='text-sm font-medium text-slate-600'>Total Steps</span>
                </div>
                <span className='font-bold text-slate-800 text-lg'>{roadmapData?.initialNodes?.length || 0}</span>
              </div>
              <div className='flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100'>
                <div className='flex items-center gap-2'>
                  <div className='w-2 h-2 bg-indigo-500 rounded-full'></div>
                  <span className='text-sm font-medium text-slate-600'>Connections</span>
                </div>
                <span className='font-bold text-slate-800 text-lg'>{roadmapData?.initialEdges?.length || 0}</span>
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