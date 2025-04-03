import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Lightbulb, WebcamIcon } from 'lucide-react';
import Webcam from 'react-webcam';
import axios from 'axios';

const StartInterview = () => {
    const { interviewId } = useParams();
    const navigate = useNavigate();
    const [interviewData, setInterviewData] = useState(null);
    const [webCamEnabled, setWebCamEnabled] = useState(false);
    const NODE_API = import.meta.env.VITE_NODE_API;
    useEffect(() => {
        GetInterviewDetails();
    }, []);

    const GetInterviewDetails = async () => {
        try {
            const response = await axios.get(`${NODE_API}/interview/${interviewId}`);
            setInterviewData(response.data);
        } catch (error) {
            console.error('Error fetching interview details:', error);
        }
    };

    return (
        <div className='container mx-auto px-4 my-10'>
            <h2 className='font-bold text-2xl mb-6'>Let's Get Started</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
                <div className='flex flex-col my-5 gap-5'>
                    <div className='flex flex-col p-5 rounded-lg border border-gray-300'>
                        <h2 className='text-lg mb-2'>
                            <strong>Job Role/Job Position: </strong>
                            {interviewData?.jobPosition}
                        </h2>
                        <h2 className='text-lg mb-2'>
                            <strong>Job Description/Tech Stack: </strong>
                            {interviewData?.jobDesc}
                        </h2>
                        <h2 className='text-lg'>
                            <strong>Years Of Experience: </strong>
                            {interviewData?.jobExperience}
                        </h2>
                    </div>
                    <div className='p-5 border rounded-lg border-yellow-300 bg-yellow-100 cursor-pointer'>
                        <h2 className='flex gap-2 items-center text-yellow-600 mb-3'>
                            <Lightbulb className='text-yellow-500' />
                            <strong>Information</strong>
                        </h2>
                        <p className='text-yellow-600'>
                            Enable Video Web Cam and Microphone to start your AI Generated Mock Interview. 
                            You will be given 5 questions which you will have to answer based on your tech stack. 
                            In the end, you will get a report based on your answers.
                        </p>
                    </div>
                </div>
                <div>
                    {webCamEnabled ? (
                        <Webcam
                            onUserMedia={() => setWebCamEnabled(true)}
                            onUserMediaError={() => setWebCamEnabled(false)}
                            mirrored={true}
                            style={{ height: 300, width: 300 }}
                        />
                    ) : (
                        <div>
                            <WebcamIcon className='h-72 w-full my-7 p-20 bg-gray-100 rounded-lg border' />
                            <button 
                                className='w-full px-4 py-2 bg-blue-600 text-white rounded-lg 
                                           hover:bg-blue-700 transition-colors focus:outline-none 
                                           focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer'
                                onClick={() => setWebCamEnabled(true)}
                            >
                                Enable Web Cam and Microphone
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <div className='flex justify-end mt-4 items-end'>
                <button 
                    className='px-6 py-2 bg-blue-600 text-white rounded-lg 
                               hover:bg-blue-700 transition-colors focus:outline-none 
                               focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer'
                    onClick={() => navigate(`/interview/${interviewId}/start`)}
                >
                    Start Interview
                </button>
            </div>
        </div>
    );
};

export default StartInterview;