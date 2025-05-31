import React, { useState, useEffect, useRef } from 'react';
import Webcam from 'react-webcam';
import { Mic, StopCircle } from 'lucide-react';
import axios from 'axios';
import { chatSession } from '../../configs/GeminiAiModel';
import { toast } from 'react-toastify';
import webcamImage from '../../assets/webcam.png';

const RecordAnswerSection = ({ activeQuestionIndex, mockInterviewQuestion, interviewData }) => {
    const [userAnswer, setUserAnswer] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [loading, setLoading] = useState(false);
    const recognitionRef = useRef(null);
    const NODE_API = import.meta.env.VITE_NODE_API;

    // Initialize speech recognition
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (!SpeechRecognition) {
            toast.error("Your browser doesn't support speech recognition. Please use Chrome, Edge, or Safari.");
            return;
        }

        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event) => {
            const transcript = Array.from(event.results)
                .map(result => result[0].transcript)
                .join('');
            setUserAnswer(transcript);
        };

        recognitionRef.current.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            toast.error(`Speech recognition error: ${event.error}`);
            stopRecording();
        };

        recognitionRef.current.onend = () => {
            setIsRecording(false);
        };

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);

    const startRecording = () => {
        if (recognitionRef.current) {
            try {
                recognitionRef.current.start();
                setIsRecording(true);
                setUserAnswer(''); // Clear previous answer
            } catch (error) {
                console.error('Error starting recording:', error);
                toast.error('Failed to start recording. Please try again.');
            }
        }
    };

    const stopRecording = () => {
        if (recognitionRef.current && isRecording) {
            recognitionRef.current.stop();
            setIsRecording(false);
        }
    };

    const toggleRecording = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    // Submit when recording stops and answer exists
    useEffect(() => {
        if (!isRecording && userAnswer.length > 10) {
            updateUserAnswer();
        }
    }, [isRecording, userAnswer]);

    const updateUserAnswer = async () => {
        try {
            setLoading(true);
            const questionText = mockInterviewQuestion[activeQuestionIndex]?.question;
            const feedbackPrompt = `Question: ${questionText}, User Answer: ${userAnswer}. Depending on the question and answer, please provide a rating and feedback (3-5 lines) in JSON format with 'rating' and 'feedback' fields.`;

            const result = await chatSession.sendMessage(feedbackPrompt);
            const responseText = result.response.text();
            
            // Extract JSON from the response
            const jsonStart = responseText.indexOf('{');
            const jsonEnd = responseText.lastIndexOf('}') + 1;
            const jsonString = responseText.slice(jsonStart, jsonEnd);
            
            const jsonFeedbackResp = JSON.parse(jsonString);
            
            const userAnswerData = {
                mockIdRef: interviewData?._id,
                question: questionText,
                correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer,
                userAns: userAnswer,
                feedback: jsonFeedbackResp?.feedback,
                rating: jsonFeedbackResp?.rating,
                userId: interviewData?.user,
            };

            // Send data to backend
            const response = await axios.post(`${NODE_API}/interview/user-answer`, userAnswerData);

            if (response.status === 201) {
                toast.success('Answer recorded successfully');
            }
        } catch (error) {
            console.error('Error updating user answer:', error);
            toast.error('Failed to record answer');
        } finally {
            setLoading(false);
            setUserAnswer(''); // Clear the answer after submission
        }
    };

    // Check browser support
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
        return (
            <div className="w-full p-8 text-center bg-yellow-50 rounded-xl">
                <p className="text-red-500 font-medium">
                    Your browser doesn't support speech recognition. 
                    Please use Chrome, Edge, or Safari.
                </p>
            </div>
        );
    }

    return (
        <div className="w-full p-2 sm:p-4 flex items-center justify-center flex-col space-y-3 sm:space-y-6">
            {/* Webcam container */}
            <div className="relative w-full max-w-md bg-gray-500 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl overflow-hidden">
                <div className="absolute inset-0 z-0 flex items-center justify-center">
                    <img 
                        src={webcamImage} 
                        alt="Webcam Icon" 
                        className="w-1/2 h-1/2 object-contain" 
                    />
                </div>
                <div className="relative z-10">
                    <Webcam 
                        mirrored 
                        className="w-full h-[250px] sm:h-[350px] object-cover rounded-xl sm:rounded-2xl" 
                    />
                </div>
            </div>

            {/* Control buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center w-full space-y-2 sm:space-y-0 sm:space-x-4">
                <button 
                    disabled={loading} 
                    onClick={toggleRecording}
                    className={`
                        w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold transition-all duration-300 
                        flex items-center justify-center gap-2
                        ${isRecording 
                            ? 'bg-red-500 text-white animate-pulse hover:bg-red-600' 
                            : 'bg-blue-500 text-white hover:bg-blue-600 hover:shadow-lg'
                        }
                        ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    `}
                >
                    {isRecording ? (
                        <>
                            <StopCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                            Stop Recording
                        </>
                    ) : (
                        <>
                            <Mic className="w-4 h-4 sm:w-5 sm:h-5" />
                            Record Answer
                        </>
                    )}
                </button>

                {userAnswer && !isRecording && (
                    <button 
                        onClick={() => setUserAnswer('')}
                        className="
                            w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold 
                            bg-gray-200 text-gray-700 
                            hover:bg-gray-300 
                            transition-all duration-300 
                            flex items-center justify-center
                        "
                    >
                        Clear Answer
                    </button>
                )}
            </div>

            {/* Transcript preview */}
            <div className="w-full max-w-md min-h-[60px] p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                <p className="text-gray-700">
                    {userAnswer || "Your answer will appear here..."}
                </p>
            </div>
            
            {/* Loading indicator */}
            {loading && (
                <div className="mt-4 text-blue-500 flex items-center">
                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing your answer...
                </div>
            )}
        </div>
    );
};

export default RecordAnswerSection;