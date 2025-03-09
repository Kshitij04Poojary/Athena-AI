import React, { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import axios from "axios";
import { motion } from "framer-motion";
import MenteeProfileForm from "../../components/MenteeProfileForm";
import generateResume from "../../components/generateResume";
import {
  Edit2,
  BookOpen,
  Briefcase,
  Award,
  Target,
  ArrowLeft,
  User,
  Download,
} from "lucide-react";

const ProfilePage = () => {
  const { user } = useUser();
  const [menteeData, setMenteeData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenteeData = async () => {
      if (user?.role === "mentee") {
        try {
          const response = await axios.get(
            "http://localhost:8000/api/mentee/profile",
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          setMenteeData(response.data);
          console.log("Mentee data:", response.data);
        } catch (error) {
          console.error("Error fetching mentee data:", error);
        }
      }
      setLoading(false);
    };

    fetchMenteeData();
  }, [user?.role]);

  const handleUpdate = async (updatedData) => {
    try {
      const response = await axios.put(
        "http://localhost:8000/api/mentee/profile",
        updatedData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setMenteeData(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  if (!user || loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse text-center">
          <div className="w-24 h-24 bg-gradient-to-r from-indigo-300 to-purple-300 rounded-full mx-auto mb-4"></div>
          <div className="h-8 bg-gray-200 rounded-md w-64 mx-auto mb-2"></div>
          <div className="h-4 bg-gray-200 rounded-md w-48 mx-auto"></div>
        </div>
      </div>
    );

  const renderMenteeProfile = () => {
    if (!menteeData) {
      return (
        <div className="text-center py-16 glass-card rounded-2xl bg-gradient-to-b from-white/90 to-white/70 shadow-xl">
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <User size={36} className="text-indigo-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">
            Complete Your Profile
          </h3>
          <p className="text-gray-600 max-w-md mx-auto mb-8">
            No mentee profile found. Let's create your professional profile to
            showcase your skills and achievements.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsEditing(true)}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 px-8 rounded-xl font-medium shadow-lg"
          >
            Create Profile
          </motion.button>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        {/* Academic Information */}
        <section className="glass-card p-8 rounded-2xl bg-gradient-to-b from-white/90 to-white/70 shadow-lg transition-all hover:shadow-xl">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-gray-800">
            <BookOpen className="text-blue-500" size={28} />
            <span>Academic Journey</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Class 10 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white/60 p-6 rounded-xl shadow-sm hover:shadow-md transition-all"
            >
              <h3 className="font-semibold text-gray-700 mb-3 text-lg">
                Class 10
              </h3>
              <p className="text-gray-900 font-medium">
                {menteeData?.academics?.class10?.school || "Not specified"}
              </p>
              <p className="text-gray-600">
                Percentage:{" "}
                <span className="font-medium">
                  {menteeData?.academics?.class10?.percentage || "N/A"}%
                </span>
              </p>
              <p className="text-gray-600">
                Year:{" "}
                <span className="font-medium">
                  {menteeData?.academics?.class10?.yearOfCompletion || "N/A"}
                </span>
              </p>
            </motion.div>

            {/* Class 12 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-white/60 p-6 rounded-xl shadow-sm hover:shadow-md transition-all"
            >
              <h3 className="font-semibold text-gray-700 mb-3 text-lg">
                Class 12
              </h3>
              <p className="text-gray-900 font-medium">
                {menteeData?.academics?.class12?.school || "Not specified"}
              </p>
              <p className="text-gray-600">
                Percentage:{" "}
                <span className="font-medium">
                  {menteeData?.academics?.class12?.percentage || "N/A"}%
                </span>
              </p>
              <p className="text-gray-600">
                Year:{" "}
                <span className="font-medium">
                  {menteeData?.academics?.class12?.yearOfCompletion || "N/A"}
                </span>
              </p>
            </motion.div>

            {/* Current Education */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="md:col-span-2 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-all border-l-4 border-blue-500"
            >
              <h3 className="font-semibold text-gray-800 mb-3 text-lg">
                Current Education
              </h3>
              <p className="text-gray-900 font-medium text-lg">
                {menteeData?.academics?.currentEducation?.institution ||
                  "Not specified"}
              </p>
              <p className="text-gray-700">
                {menteeData?.academics?.currentEducation?.course || "N/A"}
                {menteeData?.academics?.currentEducation?.specialization && (
                  <span>
                    {" "}
                    - {menteeData?.academics?.currentEducation?.specialization}
                  </span>
                )}
              </p>
              <div className="flex flex-wrap gap-6 mt-2">
                <p className="text-gray-600">
                  <span className="font-medium">Year:</span>{" "}
                  {menteeData?.academics?.currentEducation?.yearOfStudy ||
                    "N/A"}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">CGPA:</span>{" "}
                  {menteeData?.academics?.currentEducation?.cgpa || "N/A"}
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Experience */}
        <section className="glass-card p-8 rounded-2xl bg-gradient-to-b from-white/90 to-white/70 shadow-lg transition-all hover:shadow-xl">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-gray-800">
            <Briefcase className="text-purple-500" size={28} />
            <span>Experience & Achievements</span>
          </h2>

          <div className="space-y-8">
            {/* Extracurricular Activities */}
            {menteeData?.extracurricular?.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-4 text-lg flex items-center gap-2">
                  <Award size={18} className="text-yellow-500" />
                  Extracurricular Activities
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {menteeData.extracurricular.map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="p-5 bg-white/70 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100"
                    >
                      <h4 className="font-medium text-lg text-gray-800">
                        {activity?.activity || "Activity"}
                      </h4>
                      <p className="text-gray-700 font-medium">
                        {activity?.role || "Role"}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {activity?.duration || "Duration"}
                      </p>
                      <p className="text-sm text-gray-600 mt-3 line-clamp-3">
                        {activity?.description || "No description provided"}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Internships */}
            {menteeData?.internships?.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-4 text-lg flex items-center gap-2">
                  <Briefcase size={18} className="text-blue-500" />
                  Internships
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {menteeData.internships.map((internship, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="p-5 bg-gradient-to-br from-indigo-50 to-white rounded-xl shadow-sm hover:shadow-md transition-all border border-indigo-100"
                    >
                      <h4 className="font-medium text-lg text-indigo-900">
                        {internship.company || "Company"}
                      </h4>
                      <p className="text-indigo-700 font-medium">
                        {internship.role || "Role"}
                      </p>
                      <p className="text-sm text-indigo-500 mt-1">
                        {internship.duration || "Duration"}
                      </p>
                      <p className="text-sm text-gray-600 mt-3 line-clamp-3">
                        {internship.description || "No description provided"}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Achievements */}
            {menteeData?.achievements?.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-4 text-lg flex items-center gap-2">
                  <Award size={18} className="text-amber-500" />
                  Achievements
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {menteeData.achievements.map((achievement, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="p-5 bg-gradient-to-br from-amber-50 to-white rounded-xl shadow-sm hover:shadow-md transition-all border border-amber-100"
                    >
                      <h4 className="font-medium text-lg text-amber-900">
                        {achievement.title || "Achievement"}
                      </h4>
                      <p className="text-sm text-amber-600 mt-1">
                        Year: {achievement.year || "N/A"}
                      </p>
                      <p className="text-sm text-gray-600 mt-3">
                        {achievement.description || "No description provided"}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {!menteeData.extracurricular?.length &&
              !menteeData.internships?.length &&
              !menteeData.achievements?.length && (
                <div className="text-center py-6 bg-gray-50 rounded-xl">
                  <p className="text-gray-500">
                    No experience information added yet
                  </p>
                </div>
              )}
          </div>
        </section>

        {/* Future Goals */}
        <section className="glass-card p-8 rounded-2xl bg-gradient-to-b from-white/90 to-white/70 shadow-lg transition-all hover:shadow-xl">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-gray-800">
            <Target className="text-green-500" size={28} />
            <span>Future Goals</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="p-6 bg-gradient-to-br from-green-50 to-white rounded-xl shadow-sm border border-green-100"
            >
              <h3 className="font-semibold text-gray-800 mb-3 text-lg">
                Short Term Goals
              </h3>
              <p className="text-gray-700 italic">
                {menteeData?.futureGoals?.shortTerm ||
                  "No short-term goals specified"}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="p-6 bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-sm border border-blue-100"
            >
              <h3 className="font-semibold text-gray-800 mb-3 text-lg">
                Long Term Goals
              </h3>
              <p className="text-gray-700 italic">
                {menteeData?.futureGoals?.longTerm ||
                  "No long-term goals specified"}
              </p>
            </motion.div>

            {menteeData?.futureGoals?.dreamCompanies?.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="md:col-span-2 p-6 bg-gradient-to-br from-purple-50 to-white rounded-xl shadow-sm border border-purple-100"
              >
                <h3 className="font-semibold text-gray-800 mb-3 text-lg">
                  Dream Companies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {menteeData.futureGoals.dreamCompanies.map(
                    (company, index) => (
                      <motion.span
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full text-sm font-medium shadow-sm"
                      >
                        {company}
                      </motion.span>
                    )
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </section>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6 flex flex-col gap-8">
      {/* Header with Cover Photo */}
      <div className="relative">
        <div className="w-full h-48 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl overflow-hidden shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>
        </div>

        {/* Profile Info */}
        <div className="relative -mt-16 ml-8 flex items-end">
          <div className="w-32 h-32 rounded-full border-4 border-white bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
            {user?.name?.charAt(0)?.toUpperCase() || "G"}
          </div>
          <div className="ml-6 mb-4">
            <h1 className="text-4xl font-bold leading-9 text-white drop-shadow-md">
              {user.name}
            </h1>
            <p className="text-white/90">{user.email}</p>
            <div className="mt-1">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-sm rounded-full">
                {user.userType || "Student"}
              </span>
            </div>
          </div>

          {user.role === "mentee" && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(!isEditing)}
              className="ml-auto mr-8 mb-4 flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white text-indigo-700 shadow-lg border-none hover:bg-indigo-50 transition-colors"
            >
              <Edit2 size={18} />
              {isEditing ? "Cancel Edit" : "Edit Profile"}
            </motion.button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col gap-8">
        {/* Mentee Specific Information */}
        {user.role === "mentee" &&
          (isEditing ? (
            <MenteeProfileForm
              initialData={menteeData}
              onComplete={handleUpdate}
            />
          ) : (
            renderMenteeProfile()
          ))}
        {/* Add this inside the main content div, after the mentee profile sections */}
        {user.role === "mentee" && !isEditing && menteeData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mt-8"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => generateResume(menteeData)}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download Resume
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
