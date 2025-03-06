import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useUser } from "../../context/UserContext";
import axios from "axios";
import { ArrowLeft } from 'lucide-react';
import io from 'socket.io-client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./ConsultationRoom.css";
const APP_ID = 2030731488;
const SERVER_SECRET = 'bc0fb9a32a2db1941c02ecc00521f5c1';
const BACKEND_URL = "http://localhost:8000";
import { PhoneOff,Video } from "lucide-react";

function ConsultationRoom() {
  const [isMentor, setIsMentor] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const { roomId } = useParams();
  const {user}=useUser();
  const navigate = useNavigate();
  const [lecture, setLecture] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const zpRef = useRef(null);
  const socketRef = useRef(null);
  // In your existing state section
const [mediaRecorder, setMediaRecorder] = useState(null);


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || !user) {
      navigate('/login');
      return;
    }

    const fetchLectureDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/lectures/room/${roomId}`, {
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
    console.log("User role:", user.role, "Is Mentor:", mentorRole);

    socketRef.current = io(BACKEND_URL, {
      auth: {
        token: localStorage.getItem('token')
      }
      // withCredentials: true,
      // autoConnect: true
    });

    socketRef.current.on('connect', () => {
      console.log('Socket connected with ID:', socketRef.current.id);
      
      socketRef.current.emit('register', { 
        userId: user._id, 
        role: user.role,
        name: user.name 
      });
      console.log('Registered user:', { userId: user._id, role: user.role, name: user.name });
    });

    socketRef.current.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    return () => {
      if (socketRef.current) {
        console.log('Disconnecting socket');
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
      console.log("Zego instance created:", zpRef.current);
      zpRef.current.joinRoom({
        container: document.getElementById("zego-container"),
        scenario: {
          mode: ZegoUIKitPrebuilt.GroupCall,
        },
        // showScreenSharingButton: user.role === 'mentor',
        // showPreJoinView: true,
        showUserList: true,
        showTextChat: true,
        turnOnMicrophoneWhenJoining: true,
        turnOnCameraWhenJoining: true,
        onLeaveRoom: async () => {
          
          await handleEndCall();
        }
      });
    } catch (error) {
      console.error("Error starting Zego call:", error);
      setError("Failed to start video call");
    }
  };

  const handleEndCall = async () => {
    try {
      // console.log(zpRef);
      if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
        setIsRecording(false);
    }
      
      const token = localStorage.getItem('token');
      // Update lecture status to completed
      if(user.role === 'mentor'){
        await axios.put(`http://localhost:8000/api/lectures/${lecture._id}/status`, 
          { status: 'completed' }, 
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
    
      socketRef.current.emit('leave_lecture', {
        roomId,
        userId: user._id,
        role: user.role
      });
      navigate(user.role === 'mentor' ? '/mentor' : '/mentee');
    } catch (error) {
      console.error("Error ending call:", error);
      toast.error("Failed to update lecture status");
    }
  };

  
  useEffect(() => {
    if (lecture && !isLoading) {
      startZegoCall();
    }
  }, [lecture, isLoading]);

  // Add these functions AFTER handleEndCall but BEFORE the return statement
const startLocalRecording = async () => {
  try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ 
          video: true, 
          audio: true 
      });
      const recorder = new MediaRecorder(stream);
      let chunks = [];

      recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
              chunks.push(event.data);
          }
      };

      recorder.onstop = async () => {
          const blob = new Blob(chunks, { type: 'video/webm' });
          await uploadToCloudinary(blob);
          stream.getTracks().forEach(track => track.stop());
      };

      recorder.start(1000);
      setMediaRecorder(recorder);
      setIsRecording(true);
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
          formData
      );

      await axios.put(
          `${BACKEND_URL}/api/lectures/${lecture._id}/recording`,
          { recordingUrl: response.data.secure_url },
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }}
      );
  } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Recording upload failed");
  }
};

 {/* Loading State */}
 {isLoading && (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
  </div>
)}

   {error && (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white/20 backdrop-blur-md p-8 rounded-xl">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
        <p className="text-white">{error}</p>
      </div>
    </div>
  )}

  return (
    <div className="consultation-room-container min-h-screen p-4">
    <ToastContainer position="top-right"/>
    
    {/* Header with enhanced styling */}
    <header className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg p-6 mb-6">
    <div className="flex items-center justify-between">
    <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200"
          >
            <ArrowLeft size={24} className="text-white" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">{lecture?.title}</h1>
            <p className="text-sm text-white/80 mt-1">
              Room ID: {roomId}
            </p>
          </div>
        </div>
        
        {/* Recording Controls */}
        {isMentor && (
          <div className="flex items-center gap-4">
            {isRecording ? (
              <div className="recording-indicator bg-red-100/10 px-4 py-2 rounded-lg">
                <span className="mr-2">●</span>
                <span className="font-medium">Recording</span>
              </div>
            ) : (
              <button
                onClick={startLocalRecording}
                className="start-recording-btn flex items-center gap-2"
              >
                <Video size={20} />
                Start Recording
              </button>
            )}
          </div>
        )}
      </div>
    </header>
    {!isLoading && !error && (
        <div className="grid grid-cols-12 gap-4 h-[calc(100vh-12rem)] p-4">
          <div className="col-span-12 zego-video-container">
            <div id="zego-container" className="w-full h-full" />
          </div>
        </div>
      )}   
            {/* Main Content with Grid Layout */}
              
      {/* End Call Button */}
    
      </div>
  );
}

export default ConsultationRoom;