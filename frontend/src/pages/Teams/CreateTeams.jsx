import React, { useState } from 'react';
import teamList from '../../data/teamList';
import { motion } from 'framer-motion';

function CreateTeams() {
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedMentor, setSelectedMentor] = useState('');
  const [selectedMentees, setSelectedMentees] = useState([]);
  const [isCreatingTeam, setIsCreatingTeam] = useState(false);

  const mentorList = ['John Doe', 'Jane Smith', 'Robert Johnson'];
  const menteeList = ['Alice', 'Bob', 'Charlie', 'David', 'Emily'];

  const handleAddMentee = (e) => {
    const menteeName = e.target.value;
    if (menteeName && !selectedMentees.includes(menteeName)) {
      setSelectedMentees([...selectedMentees, menteeName]);
    }
  };

  const handleCreateTeam = () => {
    if (!selectedTeam || !selectedMentor || selectedMentees.length === 0) {
      alert('Please fill all fields');
      return;
    }

    setIsCreatingTeam(true);

    // Simulate API call
    setTimeout(() => {
      const teamData = {
        teamName: selectedTeam,
        mentor: selectedMentor,
        mentees: selectedMentees,
      };

      console.log('✅ Team Created:', teamData);
      alert('Team created successfully!');

      // TODO: Send this data to backend API using Axios
      // axios.post('/api/teams', teamData)

      // Reset form
      setSelectedTeam('');
      setSelectedMentor('');
      setSelectedMentees([]);
      setIsCreatingTeam(false);
    }, 800);
  };

  const getCompletionPercentage = () => {
    let steps = 0;
    if (selectedTeam) steps++;
    if (selectedMentor) steps++;
    if (selectedMentees.length > 0) steps++;
    return (steps / 3) * 100;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto p-8 bg-white rounded-2xl shadow-xl"
    >
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Create a New Team</h2>
        <p className="text-gray-500">Assemble your perfect team with a mentor and mentees</p>
        
        {/* Progress bar */}
        <div className="mt-6">
          <div className="flex justify-between mb-2 text-sm">
            <span className="text-gray-600">Completion</span>
            <span className="font-medium">{Math.round(getCompletionPercentage())}%</span>
          </div>
          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-600"
              initial={{ width: 0 }}
              animate={{ width: `${getCompletionPercentage()}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Select Team */}
        <motion.div 
          className="mb-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <label className="block text-gray-700 font-medium mb-2">
            Team Name
          </label>
          <div className="relative">
            <select
              className="w-full border border-gray-300 rounded-lg p-3 pr-10 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
            >
              <option value="" disabled>Select a Team</option>
              {teamList.map((team, index) => (
                <option key={index} value={team}>
                  {team}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          {selectedTeam && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-2 text-sm text-blue-600"
            >
              Team "{selectedTeam}" selected
            </motion.p>
          )}
        </motion.div>

        {/* Select Mentor */}
        <motion.div 
          className="mb-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <label className="block text-gray-700 font-medium mb-2">
            Team Mentor
          </label>
          <div className="relative">
            <select
              className="w-full border border-gray-300 rounded-lg p-3 pr-10 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
              value={selectedMentor}
              onChange={(e) => setSelectedMentor(e.target.value)}
            >
              <option value="" disabled>Select a Mentor</option>
              {mentorList.map((mentor, index) => (
                <option key={index} value={mentor}>
                  {mentor}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          {selectedMentor && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-2 text-sm text-blue-600 flex items-center"
            >
              <svg className="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Mentor: {selectedMentor}
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Select Mentees */}
      <motion.div 
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <label className="block text-gray-700 font-medium mb-2">
          Team Members
        </label>
        <div className="relative">
          <select
            className="w-full border border-gray-300 rounded-lg p-3 pr-10 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
            onChange={handleAddMentee}
            value=""
          >
            <option value="" disabled>Add Team Members</option>
            {menteeList
              .filter(mentee => !selectedMentees.includes(mentee))
              .map((mentee, index) => (
                <option key={index} value={mentee}>
                  {mentee}
                </option>
              ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Display Mentee List */}
        <motion.div 
          className="mt-5 overflow-hidden"
          animate={{ height: selectedMentees.length > 0 ? 'auto' : 0 }}
        >
          {selectedMentees.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-gray-700 font-medium">Team Members ({selectedMentees.length})</h4>
                {selectedMentees.length > 0 && (
                  <button 
                    className="text-xs text-red-500 hover:text-red-700"
                    onClick={() => setSelectedMentees([])}
                  >
                    Clear All
                  </button>
                )}
              </div>
              <div className="space-y-2">
                {selectedMentees.map((mentee, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-center">
                      <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                        {mentee.charAt(0)}
                      </div>
                      <span className="text-gray-700">{mentee}</span>
                    </div>
                    <button
                      className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1 rounded transition-colors duration-200"
                      onClick={() => setSelectedMentees(selectedMentees.filter((m) => m !== mentee))}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* Create Team Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleCreateTeam}
        disabled={isCreatingTeam}
        className={`w-full py-3 px-4 rounded-lg shadow-md text-white font-medium 
          flex items-center justify-center transition-all duration-200
          ${!selectedTeam || !selectedMentor || selectedMentees.length === 0
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800'
          }`}
      >
        {isCreatingTeam ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Creating Team...
          </>
        ) : (
          <>
            <svg className="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create Team
          </>
        )}
      </motion.button>

      {/* Helpful note */}
      <p className="text-center text-gray-500 text-sm mt-4">
        Teams need at least one mentor and one team member
      </p>
    </motion.div>
  );
}

export default CreateTeams;