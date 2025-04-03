import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function TeamsCard({ team }) {
  const navigate = useNavigate();
  const [latestLecture, setLatestLecture] = useState(null);
  const NODE_API = import.meta.env.VITE_NODE_API;
  // Fetch the latest lecture based on teamId
  useEffect(() => {
    const fetchLatestLecture = async () => {
      try {
        const response = await fetch(`${NODE_API}/teams/latest-lectures/team?teamId=${team._id}`);
        if (!response.ok) throw new Error('Failed to fetch lecture');
        const data = await response.json();
        setLatestLecture(data.latestLecture);
      } catch (error) {
        console.error('Error fetching lecture:', error);
      }
    };

    fetchLatestLecture();
  }, [team._id]);

  const handleJoinLecture = () => {
    if (latestLecture && latestLecture.roomId) {
      navigate(`/lecture/${latestLecture.roomId}`);
    }
  };

  return (
    <div
      className="bg-white shadow-md rounded-lg p-4 border relative cursor-pointer"
      onClick={() => navigate(`/teams/${team._id}`)}
    >
      {/* Live Tag */}
      {latestLecture && latestLecture.status === 'ongoing' && (
        <div
          className="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-lg cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            handleJoinLecture();
          }}
        >
          Live
        </div>
      )}

      {/* Team Name */}
      <h3 className="text-lg font-semibold">{team.teamname}</h3>
      <p className="text-gray-500 text-sm">
        Mentor: <span className="font-medium">{team.mentor.user.name}</span>
      </p>

      {/* Latest Lecture Details */}
      {latestLecture && (
        <div className="text-sm mt-2">
          <p><b>Lecture:</b> {latestLecture.title}</p>
          <p><b>Status:</b> {latestLecture.status}</p>
          <p><b>Start Time:</b> {new Date(latestLecture.startTime).toLocaleString()}</p>
        </div>
      )}

      {/* Join Button */}
      {latestLecture && latestLecture.status === 'ongoing' && (
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg mt-4 w-full hover:bg-blue-700 transition"
          onClick={(e) => {
            e.stopPropagation();
            handleJoinLecture();
          }}
        >
          Join Lecture
        </button>
      )}
    </div>
  );
}

export default TeamsCard;
