import React, { useEffect, useState } from 'react';
import QuestionsSection from './QuestionsSection';
import RecordAnswerSection from './RecordAnswerSection';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

const MainInterview = () => {
    const { interviewId } = useParams(); 
    const [interviewData, setInterviewData] = useState(null);
    const [mockInterviewQuestion, setMockInterviewQuestion] = useState([]);
    const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
    const NODE_API = import.meta.env.VITE_NODE_API;
    useEffect(() => {
        GetInterviewDetails();
    }, []);

    const GetInterviewDetails = async () => {
        try {
            const response = await axios.get(`${NODE_API}/interview/${interviewId}`);
            const result = response.data;    
            const parsedData = JSON.parse(result.jsonMockResp);
            setMockInterviewQuestion(parsedData);
            setInterviewData(result);

            // console.log("Interview Data:", result);
            // console.log("Mock Interview:", parsedData);
        } catch (error) {
            console.error('Error fetching interview details:', error);
        }
    };
    

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                <QuestionsSection 
                    activeQuestionIndex={activeQuestionIndex}
                    mockInterviewQuestion={mockInterviewQuestion}
                />
                <RecordAnswerSection
                    activeQuestionIndex={activeQuestionIndex}
                    mockInterviewQuestion={mockInterviewQuestion}
                    interviewData={interviewData}
                />
            </div>
            <div className='flex justify-end space-x-4 w-full'>
                {activeQuestionIndex > 0 && (
                    <button 
                        onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}
                        className="px-6 py-3 bg-gray-200 text-gray-800 rounded-full 
                        transition duration-300 ease-in-out 
                        hover:bg-gray-300 cursor-pointer hover:shadow-md
                        focus:outline-none focus:ring-2 focus:ring-gray-400"
                    >
                        Previous Question
                    </button>
                )}
                {activeQuestionIndex !== mockInterviewQuestion.length - 1 && (
                    <button 
                        onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}
                        className="px-6 py-3 cursor-pointer bg-blue-500 text-white rounded-full 
                        transition duration-300 ease-in-out 
                        hover:bg-blue-600 hover:shadow-lg
                        focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        Next Question
                    </button>
                )}
                {activeQuestionIndex === mockInterviewQuestion.length - 1 && (
                    <Link to={`/interview/${interviewData?._id}/feedback`}>
                        <button className="cursor-pointer px-6 py-3 bg-green-500 text-white rounded-full 
                        transition duration-300 ease-in-out 
                        hover:bg-green-600 hover:shadow-lg
                        focus:outline-none focus:ring-2 focus:ring-green-400">
                            End Interview
                        </button>
                    </Link>
                )}
            </div>
        </div>
    );
};

export default MainInterview;