import React, { useEffect, useState } from 'react';
import { useUser } from '../../context/UserContext';
import TeamsCard from './TeamsCard';

function MyTeams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useUser();

  useEffect(() => {
    if (!user) return;

    const fetchTeams = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/teams?userId=${user._id}`);
        if (!response.ok) throw new Error('Failed to fetch teams');

        const data = await response.json();
        setTeams(data);
      } catch (error) {
        console.error('Error fetching teams:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, [user]);

  if (!user) return <p>Loading user info...</p>;
  if (loading) return <p>Loading teams...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">My Teams</h2>

      {teams.length === 0 ? (
        <p className="text-gray-500">No teams found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <TeamsCard 
              key={team.teamId} 
              team={team.teamDetails} 
              mentorId={team.mentorId} 
              menteeId={team.menteeId} 
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default MyTeams;
