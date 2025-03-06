import React from 'react';
import { useUser } from '../../context/UserContext';

const ProfilePage = () => {
    const { user } = useUser();

    if (!user) return <p className="text-center text-gray-600">Loading user data...</p>;

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
            {/* Profile Header with Logo */}
            <div className="flex items-center space-x-4 mb-6">
                <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-2xl font-bold text-white shadow-md">
                        {user?.name?.charAt(0)?.toUpperCase() || 'G'}
                    </div>
                    <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-green-500 border-2 border-white"></div>
                </div>
                <div>
                    <p className="text-xl font-semibold">{user?.name || 'Guest'}</p>
                    <p className="text-sm text-gray-600">{user?.email || 'guest@example.com'}</p>
                </div>
            </div>

            {/* Basic Info */}
            <div className="space-y-4">
                <p><strong>Phone Number:</strong> {user.phoneNumber || 'N/A'}</p>
                <p><strong>User Type:</strong> {user.userType}</p>
                <p><strong>Role:</strong> {user.role || 'N/A'}</p>
            </div>

            {/* Skills Section */}
            <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800">Skills</h3>
                {user.skills?.length > 0 ? (
                    <ul className="mt-2 space-y-3">
                        {user.skills.map((skill, index) => (
                            <li key={index}>
                                <p className="font-medium">{skill.name}</p>
                                <div className="w-full bg-gray-200 h-3 rounded-lg mt-1">
                                    <div className="h-full bg-green-500 rounded-lg" style={{ width: `${skill.proficiency}%` }}></div>
                                </div>
                                <span className="text-sm text-gray-600">{skill.proficiency}%</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-600">No skills listed.</p>
                )}
            </div>

            {/* Career Goals */}
            <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800">Career Goals</h3>
                {user.careerGoals?.length > 0 ? (
                    <ul className="list-disc list-inside mt-2">
                        {user.careerGoals.map((goal, index) => <li key={index}>{goal}</li>)}
                    </ul>
                ) : (
                    <p className="text-gray-600">No career goals listed.</p>
                )}
            </div>

            {/* Social Links */}
            <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800">Social Links</h3>
                <p><strong>LinkedIn:</strong> {user.linkedin ? <a href={user.linkedin} className="text-blue-600 hover:underline" target="_blank" rel="noreferrer">LinkedIn Profile</a> : 'N/A'}</p>
                <p><strong>GitHub:</strong> {user.github ? <a href={user.github} className="text-blue-600 hover:underline" target="_blank" rel="noreferrer">GitHub Profile</a> : 'N/A'}</p>
            </div>

            {/* Preferences */}
            <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800">Preferences</h3>
                <p><strong>Location:</strong> {user.preferences?.location?.join(', ') || 'N/A'}</p>
                <p><strong>Preferred Stipend Range:</strong> {user.preferences?.preferredStipendRange || 'N/A'}</p>
                <p><strong>Remote Preference:</strong> {user.preferences?.remotePreference ? 'Yes' : 'No'}</p>
            </div>

            {/* Achievements */}
            <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800">Achievements</h3>
                {user.achievements?.length > 0 ? (
                    <ul className="list-disc list-inside mt-2">
                        {user.achievements.map((achievement, index) => <li key={index}>{achievement}</li>)}
                    </ul>
                ) : (
                    <p className="text-gray-600">No achievements listed.</p>
                )}
            </div>

            {/* Badges */}
            <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800">Badges</h3>
                {user.badges?.length > 0 ? (
                    <ul className="flex flex-wrap gap-2 mt-2">
                        {user.badges.map((badge, index) => (
                            <span key={index} className="bg-gray-200 px-3 py-1 rounded-full text-sm">{badge}</span>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-600">No badges earned.</p>
                )}
            </div>

            {/* Leaderboard Rank and Join Date */}
            <p className="mt-6"><strong>Leaderboard Rank:</strong> {user.leaderboardRank ?? 'Unranked'}</p>
            <p><strong>Joined:</strong> {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>

            {/* Update Profile Button */}
            <div className="mt-6">
                <button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:bg-blue-200 text-white font-semibold py-2 rounded-lg transition-all">
                    Update Profile
                </button>
            </div>
        </div>
    );
};

export default ProfilePage;
