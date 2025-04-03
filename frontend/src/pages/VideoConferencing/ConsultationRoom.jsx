import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useUser } from "../../context/UserContext";
import axios from "axios";
import { ArrowLeft } from 'lucide-react';
import io from 'socket.io-client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from "framer-motion";
import { PhoneOff, Video } from "lucide-react";
import Transcript from "../../components/misc/Transcript";

const APP_ID = 2030731488;
const SERVER_SECRET = 'bc0fb9a32a2db1941c02ecc00521f5c1';
const BACKEND_URL = import.meta.env.VITE_NODE_API;

function ConsultationRoom() {
  const [isMentor, setIsMentor] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const { roomId } = useParams();
  const { user } = useUser();
  const navigate = useNavigate();
  const [lecture, setLecture] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const zpRef = useRef(null);
  const socketRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordingIntervalRef = useRef(null);

  async function fetchData({secure_url,lectureId}) {
    try {
      
        const resp = await axios.post("http://127.0.0.1:5004/api/transcript/",{"path": secure_url,"lec_id":lectureId},{withCredentials: true});
        
    } catch (error) {
        console.error("Error fetching transcript:", error);
        
    } 
}

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || !user) {
      navigate('/login');
      return;
    }

    const fetchLectureDetails = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/lectures/room/${roomId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setLecture(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching lecture details:", error);
        setError("Failed to load lecture details");
        setIsLoading(false);
      }
    };

    fetchLectureDetails();
  }, [roomId, navigate, user]);

  useEffect(() => {
    const mentorRole = user.role === "mentor";
    setIsMentor(mentorRole);

    socketRef.current = io(BACKEND_URL, {
      auth: { token: localStorage.getItem('token') }
    });

    socketRef.current.on('connect', () => {
      socketRef.current.emit('register', { 
        userId: user._id, 
        role: user.role,
        name: user.name 
      });
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [user]);

  const startZegoCall = async () => {
    try {
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        APP_ID,
        SERVER_SECRET,
        roomId,
        user._id,
        user.name
      );

      zpRef.current = ZegoUIKitPrebuilt.create(kitToken);
      zpRef.current.joinRoom({
        container: document.getElementById("zego-container"),
        scenario: { mode: ZegoUIKitPrebuilt.GroupCall },
        showUserList: true,
        showTextChat: true,
        turnOnMicrophoneWhenJoining: true,
        turnOnCameraWhenJoining: true,
        onLeaveRoom: handleEndCall
      });
    } catch (error) {
      console.error("Error starting Zego call:", error);
      setError("Failed to start video call");
    }
  };

  const handleEndCall = async () => {
    try {
      if (mediaRecorderRef.current) {
        if (mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.stop();
        }
        mediaRecorderRef.current.stream?.getTracks().forEach(track => track.stop());
        clearInterval(recordingIntervalRef.current);
      }
      
      if (user.role === 'mentor') {
        const token = localStorage.getItem('token');
        await axios.put(`${BACKEND_URL}/api/lectures/${lecture._id}/status`, 
          { status: 'completed' }, 
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      
    
      socketRef.current.emit('leave_lecture', { roomId,userId: user._id,role: user.role });
      navigate(user.role === 'mentor' ? '/mentor' : '/mentee');
    } catch (error) {
      console.error("Error ending call:", error);
      toast.error("Failed to update lecture status");
    }
  };

  const startLocalRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ 
        video: true, 
        audio: true 
      });
      
      const recorder = new MediaRecorder(stream);
      let chunks = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunks.push(event.data);
      };

      recorder.onstop = async () => {
        try {
          const blob = new Blob(chunks, { type: 'video/webm' });
          await uploadToCloudinary(blob);
        } catch (error) {
          toast.error("Recording upload failed");
        } finally {
          chunks = [];
          stream.getTracks().forEach(track => track.stop());
          setIsRecording(false);
          setRecordingTime(0);
          clearInterval(recordingIntervalRef.current);
        }
      };

      recorder.start(1000);
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      
      // Recording timer
      const startTime = Date.now();
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);

      toast.success("Recording started!");

    } catch (error) {
      toast.error("Screen sharing required for recording");
    }
  };

  const uploadToCloudinary = async (blob) => {
    try {
      const formData = new FormData();
      formData.append('file', blob);
      formData.append('upload_preset', "Live_Lectures");
      
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/dhk1v7s3d/video/upload`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            toast.info(`Uploading: ${percent}%`);
          }
        }
      );

      if (!response.data.secure_url) throw new Error('No secure URL');
      await fetchData({secure_url: response.data.secure_url,lectureId:lecture._id.toString()});
      await axios.put(
        `http://localhost:8000/api/lectures/${lecture._id}/recording`,
        { recordingUrl: response.data.secure_url },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }}
      );

      toast.success("Recording uploaded successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
      throw error;
    }
  };

  useEffect(() => {
    if (lecture && !isLoading) startZegoCall();
  }, [lecture, isLoading]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1c2e] to-[#2b2f4c]">
      <ToastContainer position="top-right" />
      
      <header className="bg-white/[0.03] backdrop-blur-md border-b border-white/[0.05] p-6 mb-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(-1)}
                className="bg-white/10 backdrop-blur-sm border border-white/10 text-white p-3 rounded-lg transition-all duration-300 cursor-pointer"
              >
                <ArrowLeft size={24} />
              </motion.button>
              <div>
                <motion.h1
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
                >
                  {lecture?.title}
                </motion.h1>
                <p className="text-gray-400">Room ID: {roomId}</p>
              </div>
            </div>

            {isMentor && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-4"
              >
                {isRecording ? (
                  <div className="flex items-center gap-2 bg-red-600/20 py-2 px-4 rounded-lg animate-pulse">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-red-400 font-medium">
                      Recording ({formatTime(recordingTime)})
                    </span>
                  </div>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={startLocalRecording}
                    className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 text-white py-2 px-4 rounded-lg transition-all duration-300 cursor-pointer"
                  >
                    <Video size={20} />
                    Start Recording
                  </motion.button>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </header>

      {isLoading && (
        <div className="flex items-center justify-center h-[calc(100vh-100px)]">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
          />
        </div>
      )}

      {error && (
        <div className="flex items-center justify-center h-[calc(100vh-100px)]">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-500/10 backdrop-blur-md p-8 rounded-lg max-w-md text-center"
          >
            <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
            <p className="text-gray-300">{error}</p>
          </motion.div>
        </div>
      )}

      {!isLoading && !error && (
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/20 backdrop-blur-sm border border-white/5 rounded-2xl overflow-hidden h-[calc(100vh-180px)]"
          >
            <div id="zego-container" className="w-full h-full" />
          </motion.div>

          {/* End Call Button - Commented out in original code
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="fixed bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <div className="flex items-center gap-4 bg-black/20 backdrop-blur-md p-4 rounded-lg">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleEndCall}
                className="py-3 px-6 bg-red-600 text-white rounded-lg flex items-center gap-2 transition-all duration-300 cursor-pointer border-none"
              >
                <PhoneOff size={20} />
                End Call
              </motion.button>
            </div>
          </motion.div>
          */}
        </div>
      )}
    </div>
  );
}

export default ConsultationRoom;