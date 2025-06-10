import React, { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ProfileForm from "../../components/profile/ProfileForm";
import generateResume from "../../components/misc/generateResume";
import axios from "axios";
import {
  Edit2,
  BookOpen,
  Briefcase,
  Award,
  Target,
  User,
  Download,
  Gamepad,
} from "lucide-react";
import MentorScoresChart from '../../components/landing/MentorScoresCart';

const ProfilePage = () => {
  const { user, setUser } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const NODE_API = import.meta.env.VITE_NODE_API;
  const navigate = useNavigate();

  // Transform user data to ProfileForm format
  const transformUserDataForForm = (userData) => {
    return {
      academics: {
        class10: userData?.education?.class10 || { school: '', percentage: '', yearOfCompletion: '' },
        class12: userData?.education?.class12 || { school: '', percentage: '', yearOfCompletion: '' },
        currentEducation: userData?.education?.currentEducation || {
          institution: '', course: '', specialization: '', yearOfStudy: '', cgpa: ''
        }
      },
      hasExtracurricular: userData?.extracurricular?.length > 0 || false,
      extracurricular: userData?.extracurricular || [],
      hasInternships: userData?.internships?.length > 0 || false,
      internships: userData?.internships || [],
      hasAchievements: userData?.achievements?.length > 0 || false,
      achievements: userData?.achievements || [],
      futureGoals: {
        shortTerm: userData?.futureGoals?.shortTerm || '',
        longTerm: userData?.futureGoals?.longTerm || '',
        dreamCompanies: userData?.futureGoals?.dreamCompanies || []
      }
    };
  };

  // Transform ProfileForm data back to user format
  const transformFormDataToUser = (formData) => {
    return {
      education: {
        class10: formData.academics.class10,
        class12: formData.academics.class12,
        currentEducation: formData.academics.currentEducation
      },
      extracurricular: formData.extracurricular,
      internships: formData.internships,
      achievements: formData.achievements,
      futureGoals: formData.futureGoals
    };
  };

  const handleUpdate = async (updatedFormData) => {
    try {
      const userId = user?._id;
      if (!userId || !user?.token) {
        console.error("User ID or token missing");
        return;
      }

      setLoading(true);
      
      const transformedData = transformFormDataToUser(updatedFormData);
      
      const { data } = await axios.patch(`${NODE_API}/auth/${user._id}`, transformedData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      setUser({ ...data.user, token: user.token });
      setIsEditing(false);
    } catch (error) {
      console.error("Update failed:", error.response?.data || error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    try {
      if (!user?.token) return;

      setLoading(true);
      const { data } = await axios.get(`${NODE_API}/auth/${user._id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      setUser({ ...data.user, token: user.token });
    } catch (error) {
      console.error("Failed to fetch profile:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token && !user?.name) {
      fetchUserProfile();
    }
  }, [user?.token]);

  if (!user || loading) return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="animate-pulse text-center">
        <div className="w-24 h-24 bg-gradient-to-r from-blue-300 to-blue-400 rounded-full mx-auto mb-4"></div>
        <div className="h-8 bg-blue-200 rounded-md w-64 mx-auto mb-2"></div>
        <div className="h-4 bg-blue-200 rounded-md w-48 mx-auto"></div>
      </div>
    </div>
  );

  if (user?.userType === "Mentor") {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-white">
        <MentorScoresChart />
      </div>
    );
  }

  const renderProfile = () => {
    const hasEducation = user?.education?.class10 || user?.education?.class12 || user?.education?.currentEducation;
    const hasSkills = user?.skills && user?.skills.length > 0;

    if (!hasEducation && !user?.extracurricular?.length && !user?.internships?.length && !hasSkills) {
      return (
        <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-blue-100">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <User size={36} className="text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-blue-800 mb-3">
            Complete Your Profile
          </h3>
          <p className="text-blue-600 max-w-md mx-auto mb-8">
            Your profile is incomplete. Let's create your professional profile to
            showcase your skills and achievements.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsEditing(true)}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-8 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
            disabled={loading}
          >
            {loading ? "Loading..." : "Create Profile"}
          </motion.button>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        {/* Skills Section */}
        {hasSkills && (
          <section className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-all border border-blue-50">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-blue-800">
              <Award className="text-blue-600" size={24} />
              <span>Skills</span>
            </h2>
            <div className="flex flex-wrap gap-3">
              {user.skills.map((skill, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium shadow-sm hover:bg-blue-700 transition-colors"
                >
                  {skill.name || skill}
                </motion.span>
              ))}
            </div>
          </section>
        )}

        {/* Career Goals Section */}
        {user?.careerGoals?.length > 0 && (
          <section className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-all border border-blue-50">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-blue-800">
              <Target className="text-blue-600" size={24} />
              <span>Career Goals</span>
            </h2>
            <div className="flex flex-wrap gap-3">
              {user.careerGoals.map((goal, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium shadow-sm hover:bg-blue-200 transition-colors"
                >
                  {goal}
                </motion.span>
              ))}
            </div>
          </section>
        )}

        {/* Academic Information */}
        {hasEducation && (
          <section className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-all border border-blue-50">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-blue-800">
              <BookOpen className="text-blue-600" size={24} />
              <span>Academic Journey</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Class 10 */}
              {user?.education?.class10 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-all border border-blue-100"
                >
                  <h3 className="font-semibold text-blue-700 mb-3 text-lg">Class 10</h3>
                  <p className="text-blue-900 font-medium">{user.education.class10.school || "Not specified"}</p>
                  <p className="text-blue-600">
                    Percentage:{" "}
                    <span className="font-medium">{user.education.class10.percentage || "N/A"}%</span>
                  </p>
                  <p className="text-blue-600">
                    Year: <span className="font-medium">{user.education.class10.yearOfCompletion || "N/A"}</span>
                  </p>
                </motion.div>
              )}

              {/* Class 12 */}
              {user?.education?.class12 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-all border border-blue-100"
                >
                  <h3 className="font-semibold text-blue-700 mb-3 text-lg">Class 12</h3>
                  <p className="text-blue-900 font-medium">{user.education.class12.school || "Not specified"}</p>
                  <p className="text-blue-600">
                    Percentage:{" "}
                    <span className="font-medium">{user.education.class12.percentage || "N/A"}%</span>
                  </p>
                  <p className="text-blue-600">
                    Year: <span className="font-medium">{user.education.class12.yearOfCompletion || "N/A"}</span>
                  </p>
                </motion.div>
              )}

              {/* Current Education */}
              {user?.education?.currentEducation && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className={`${(!user?.education?.class10 || !user?.education?.class12) ? "md:col-span-2" : ""}
                  bg-blue-50 p-5 rounded-xl shadow-sm hover:shadow-md transition-all border-l-4 border-blue-600`}
                >
                  <h3 className="font-semibold text-blue-800 mb-3 text-lg">Current Education</h3>
                  <p className="text-blue-900 font-medium text-lg">
                    {user.education.currentEducation.institution || "Not specified"}
                  </p>
                  <p className="text-blue-700">
                    {user.education.currentEducation.course || "N/A"}
                    {user.education.currentEducation.specialization && (
                      <span> - {user.education.currentEducation.specialization}</span>
                    )}
                  </p>
                  <div className="flex flex-wrap gap-4 mt-2">
                    <p className="text-blue-600">
                      <span className="font-medium">Year:</span>{" "}
                      {user.education.currentEducation.yearOfStudy || "N/A"}
                    </p>
                    <p className="text-blue-600">
                      <span className="font-medium">CGPA:</span>{" "}
                      {user.education.currentEducation.cgpa || "N/A"}
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          </section>
        )}

        {/* Experience & Achievements */}
        {(user?.extracurricular?.length > 0 || user?.internships?.length > 0 || user?.achievements?.length > 0) && (
          <section className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-all border border-blue-50">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-blue-800">
              <Briefcase className="text-blue-600" size={24} />
              <span>Experience & Achievements</span>
            </h2>
            <div className="space-y-8">
              {/* Extracurricular Activities */}
              {user?.extracurricular?.length > 0 && (
                <div>
                  <h3 className="font-semibold text-blue-800 mb-4 text-lg flex items-center gap-2">
                    <Award size={18} className="text-blue-600" />
                    Extracurricular Activities
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {user.extracurricular.map((activity, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-blue-100"
                      >
                        <h4 className="font-medium text-lg text-blue-800">{activity.activity}</h4>
                        <p className="text-blue-700 font-medium">{activity.role}</p>
                        <p className="text-sm text-blue-500 mt-1">{activity.duration}</p>
                        <p className="text-sm text-blue-600 mt-2 line-clamp-3">{activity.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Internships */}
              {user?.internships?.length > 0 && (
                <div>
                  <h3 className="font-semibold text-blue-800 mb-4 text-lg flex items-center gap-2">
                    <Briefcase size={18} className="text-blue-600" />
                    Internships
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {user.internships.map((internship, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="p-4 bg-blue-50 rounded-xl shadow-sm hover:shadow-md transition-all border border-blue-200"
                      >
                        <h4 className="font-medium text-lg text-blue-900">{internship.company}</h4>
                        <p className="text-blue-700 font-medium">Role: {internship.role}</p>
                        <p className="text-sm text-blue-500 mt-1">{internship.duration} months</p>
                        <p className="text-sm text-blue-600 mt-2 line-clamp-3">{internship.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Achievements */}
              {user?.achievements?.length > 0 && (
                <div>
                  <h3 className="font-semibold text-blue-800 mb-4 text-lg flex items-center gap-2">
                    <Award size={18} className="text-blue-600" />
                    Achievements
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {user.achievements.map((achievement, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-blue-100"
                      >
                        <h4 className="font-medium text-lg text-blue-800">{achievement.title}</h4>
                        <p className="text-sm text-blue-500 mt-1">{achievement.year}</p>
                        <p className="text-sm text-blue-600 mt-2 line-clamp-3">{achievement.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Future Goals Section */}
        {(user?.futureGoals?.shortTerm || user?.futureGoals?.longTerm || user?.futureGoals?.dreamCompanies?.length > 0) && (
          <section className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-all border border-blue-50">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-blue-800">
              <Target className="text-blue-600" size={24} />
              <span>Future Goals</span>
            </h2>
            <div className="space-y-6">
              {/* Short Term Goals */}
              {user.futureGoals.shortTerm && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-all border border-blue-100"
                >
                  <h3 className="font-semibold text-blue-700 mb-3 text-lg flex items-center gap-2">
                    <Target size={18} className="text-blue-600" />
                    Short Term Goals
                  </h3>
                  <p className="text-blue-800">{user.futureGoals.shortTerm}</p>
                </motion.div>
              )}

              {/* Long Term Goals */}
              {user.futureGoals.longTerm && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-all border border-blue-100"
                >
                  <h3 className="font-semibold text-blue-700 mb-3 text-lg flex items-center gap-2">
                    <Target size={18} className="text-blue-600" />
                    Long Term Goals
                  </h3>
                  <p className="text-blue-800">{user.futureGoals.longTerm}</p>
                </motion.div>
              )}

              {/* Dream Companies */}
              {user.futureGoals.dreamCompanies && user.futureGoals.dreamCompanies.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="bg-blue-50 p-5 rounded-xl shadow-sm hover:shadow-md transition-all border-l-4 border-blue-600"
                >
                  <h3 className="font-semibold text-blue-800 mb-4 text-lg flex items-center gap-2">
                    <Briefcase size={18} className="text-blue-600" />
                    Dream Companies
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {user.futureGoals.dreamCompanies.map((company, index) => (
                      <motion.span
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium shadow-sm hover:bg-blue-700 transition-colors"
                      >
                        {company}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </section>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto min-h-screen p-6">
      {/* Header with Cover Photo */}
      <div className="relative mb-8">
        <div className="w-full h-40 bg-gradient-to-r from-purple-500 via-indigo-400 to-blue-300 rounded-xl overflow-hidden shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>
        </div>

        {/* Profile Info */}
        <div className="relative -mt-16 ml-6 flex flex-col sm:flex-row items-start sm:items-end sm:justify-between">
          <div className="w-28 h-28 rounded-full border-4 border-white bg-gradient-to-r from-purple-500 via-indigo-400 to-blue-300 flex items-center justify-center text-3xl font-bold text-white shadow-xl">
            {user?.name?.charAt(0)?.toUpperCase() || "G"}
          </div>
          <div className="sm:ml-6 mt-4 sm:mt-0 mb-4">
            <h1 className="text-3xl sm:text-4xl font-bold text-white drop-shadow-md">
              {user.name}
            </h1>
            <p className="text-white/90 text-sm sm:text-base h-auto">{user.email}</p>
            <div className="mt-5">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-sm rounded-full">
                {user.userType || "Student"}
              </span>
            </div>
          </div>

          {user.userType === "Student" && (
            <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-0 sm:ml-auto sm:mr-6 mb-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-white text-blue-700 shadow-md hover:bg-blue-50 transition-colors"
                disabled={loading}
              >
                <Edit2 size={16} />
                {loading ? "Loading..." : isEditing ? "Cancel Edit" : "Edit Profile"}
              </motion.button>
              {/*
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/game')}
                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md hover:from-purple-700 hover:to-indigo-700 transition-colors"
              >
                <Gamepad size={16} />
                Challenge Yourself
              </motion.button>
              */}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col gap-8">
        {user.userType === "Student" &&
          (isEditing ? (
            <ProfileForm
              initialData={transformUserDataForForm(user)}
              onComplete={handleUpdate}
            />
          ) : (
            <>
              {renderProfile()}

              {(user?.education || user?.extracurricular?.length || user?.internships?.length || user?.skills?.length > 0) && (
                <div className="flex justify-center gap-4 mt-8">
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => generateResume(user)}
                    className="bg-gradient-to-r from-green-500 to-green-700 text-white px-8 py-3 rounded-xl font-semibold shadow-md hover:shadow-xl transition-all flex items-center gap-2"
                    disabled={loading}
                  >
                    <Download className="w-5 h-5" />
                    {loading ? "Loading..." : "Download Resume"}
                  </motion.button>
                  
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/game')}
                    className="bg-gradient-to-r from-indigo-500 to-indigo-700 text-white px-8 py-3 rounded-xl font-semibold shadow-md hover:shadow-xl transition-all flex items-center gap-2"
                  >
                    <Gamepad className="w-5 h-5" />
                    Challenge Yourself
                  </motion.button>
                </div>
              )}
            </>
          ))}
      </div>
    </div>
  );
};

export default ProfilePage;