import React, { useState, useEffect } from "react";
import { FaWandMagicSparkles } from "react-icons/fa6";
import { HiOutlineSquare3Stack3D } from "react-icons/hi2";
import { FiTarget } from "react-icons/fi";
import { IoMdOptions } from "react-icons/io";
import axios from 'axios';
import { useUser } from '../../context/UserContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Toaster, toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useTranslation } from "react-i18next";
import SkillsStep from '../../components/course/SkillsStep';
import TopicStep from '../../components/course/TopicStep';
import OptionsStep from '../../components/course/OptionsStep';
import PreviewStep from '../../components/course/PreviewStep';

const CreateCourse = ({ prefillData = null }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();
  const [token, setToken] = useState(user?.token || localStorage.getItem('token'));
  
  useEffect(() => {
    if (user?.token) {
      setToken(user.token);
    } else if (!token) {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
      }
    }
  }, [user?.token]);
  
  // Extract prefill data from props, location state, or URL params
  const getPrefillData = () => {
    if (prefillData) return prefillData;
    if (location.state?.prefillData) return location.state.prefillData;
    
    // Extract from URL params
    const urlParams = new URLSearchParams(location.search);
    const urlPrefill = {};
    ['topic', 'description', 'difficulty', 'duration', 'noOfChp'].forEach(key => {
      const value = urlParams.get(key);
      if (value) urlPrefill[key] = key === 'noOfChp' ? Number(value) : value;
    });
    
    const skills = urlParams.get('skills');
    if (skills) urlPrefill.skills = skills.split(',').map(s => s.trim());
    
    return Object.keys(urlPrefill).length > 0 ? urlPrefill : null;
  };

  const initialPrefillData = getPrefillData();
  
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [skills, setSkills] = useState(initialPrefillData?.skills || []);
  const [apiResponse, setApiResponse] = useState({ courseLayout: [] });
  const [generatingCourse, setGeneratingCourse] = useState(false);
  const [generatingChapters, setGeneratingChapters] = useState(false);
  const NODE_API = import.meta.env.VITE_NODE_API;

  const steps = [
    { id: 1, name: t("createCourse.steps.skills"), icon: HiOutlineSquare3Stack3D },
    { id: 2, name: t("createCourse.steps.topic"), icon: FiTarget },
    { id: 3, name: t("createCourse.steps.options"), icon: IoMdOptions },
    { id: 4, name: t("createCourse.steps.generated"), icon: FaWandMagicSparkles },
  ];

  const [formData, setFormData] = useState({
    topic: initialPrefillData?.topic || "",
    description: initialPrefillData?.description || "",
    difficulty: initialPrefillData?.difficulty || "",
    duration: initialPrefillData?.duration || "",
    noOfChp: initialPrefillData?.noOfChp || "",
  });

  const isNextEnabled = () => {
    switch (step) {
      case 0: return skills.length > 0;
      case 1: return formData.topic.trim() && formData.description.trim();
      case 2: return (
        formData.difficulty &&
        formData.duration &&
        formData.noOfChp >= 1 &&
        formData.noOfChp <= 5
      );
      default: return false;
    }
  };

  const GenerateCourseLayout = async () => {
    setGeneratingCourse(true);
    try {
      const response = await fetch(`${NODE_API}/generate-course`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, skills }),
      });
  
      if (!response.ok) throw new Error(t("createCourse.errors.generateFailed"));
  
      const data = await response.json();
      setApiResponse(data);
      setStep(3);
      toast.success(t("createCourse.success.layoutGenerated"));
    } catch (error) {
      console.error(t("createCourse.errors.generateFailed"), error);
      toast.error(t("createCourse.errors.generateFailed"));
    } finally {
      setGeneratingCourse(false);
    }
  };

  const GenerateChapterContent = async () => {
    setGeneratingChapters(true);
    try {
        if (!apiResponse.courseLayout || !apiResponse.courseLayout.Chapters?.length) {
            toast.error(t("createCourse.errors.noChapters"));
            setGeneratingChapters(false);
            return;
        }

        const course = apiResponse.courseLayout;
        const updatedCourse = { ...course, Chapters: [...course.Chapters] };

        for (let i = 0; i < updatedCourse.Chapters.length; i++) {
            const chapter = updatedCourse.Chapters[i];

            const chapterPayload = {
                chapterName: chapter["Chapter Name"],
                about: chapter["About"],
                duration: chapter["Duration"],
                content: chapter["Content"],
                difficulty: course.Level,
            };

            try {
                const chapterResponse = await fetch(`${NODE_API}/generate-chapter-content`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(chapterPayload),
                });

                if (!chapterResponse.ok) {
                    throw new Error(t("createCourse.errors.chapterFailed", { chapter: chapter["Chapter Name"] }));
                }

                const { sections, video } = await chapterResponse.json();

                updatedCourse.Chapters[i] = {
                    ...chapter,
                    sections,
                    video: video ?? { url: null, thumbnail: null },
                };
            } catch (chapterError) {
                console.error(t("createCourse.errors.chapterError", { chapter: chapter["Chapter Name"] }), chapterError);
                toast.warning(t("createCourse.warnings.chapterSkipped", { chapter: chapter["Chapter Name"] }));
                updatedCourse.Chapters[i] = {
                    ...chapter,
                    sections: [],
                    video: { url: null, thumbnail: null },
                };
            }
        }

        if (!token) {
            toast.error(t("createCourse.errors.sessionExpired"));
            return;
        }

        const transformCourse = (course) => ({
            courseName: course["Course Name"],
            description: course["Description"],
            skills: course["Skills"],
            level: course["Level"],
            duration: course["Duration"],
            noOfChapters: course["NoOfChapters"],
            courseOutcomes: course["Course Outcomes"],
            chapters: course.Chapters.map(chapter => ({
                chapterName: chapter["Chapter Name"],
                about: chapter["About"],
                duration: chapter["Duration"],
                sections: chapter.sections,
                video: chapter.video ?? { url: null, thumbnail: null },
                isCompleted: chapter.isCompleted ?? false
            }))
        });

        const finalCourse = transformCourse(updatedCourse);

        try {
            const response = await axios.post(
                `${NODE_API}/courses/create-courses`,
                finalCourse,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            toast.success(t("createCourse.success.courseCreated"));
            const courseId = response.data?.course?._id;

            if (courseId) {
                if (user?.userType === 'Mentor') {
                    await createAssignedCourseForMentor(courseId);
                }

                navigate(`/course/${courseId}`);
            } else {
                toast.error(t("createCourse.errors.noCourseId"));
            }
        } catch (error) {
            console.error(t("createCourse.errors.createFailed"), error);
            if (error.response?.status === 401) {
                toast.error(t("createCourse.errors.sessionExpired"));
            } else {
                toast.error(t("createCourse.errors.saveFailed"));
            }
        }

    } catch (error) {
        console.error(t("createCourse.errors.generationFailed"), error);
        toast.error(t("createCourse.errors.generationFailed"));
    } finally {
        setGeneratingChapters(false);
    }
  };

  const createAssignedCourseForMentor = async (courseId) => {
    try {
        const assignedCoursePayload = {
            mentor: user._id,
            assigns: [],
            orgCourseId: courseId,
            dueDate: null
        };

        await axios.post(`${NODE_API}/assigned/`, assignedCoursePayload, {
            headers: { Authorization: `Bearer ${token}` }
        });
        toast.success(t("createCourse.success.assignedCreated"));
    } catch (error) {
        console.error(t("createCourse.errors.assignFailed"), error);
        toast.error(t("createCourse.errors.assignFailed"));
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <SkillsStep
            skills={skills}
            setSkills={setSkills}
          />
        );
      case 1:
        return (
          <TopicStep
            formData={formData}
            setFormData={setFormData}
          />
        );
      case 2:
        return (
          <OptionsStep
            formData={formData}
            setFormData={setFormData}
          />
        );
      case 3:
        return (
          <PreviewStep
            courseLayout={apiResponse.courseLayout}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Toaster position="top-right" richColors />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-blue-700 mb-2">
              {t("createCourse.title")}
            </h1>
            <p className="text-gray-600 text-base">
              Follow the steps to create your personalized course
            </p>
          </div>

          {/* Step Names */}
          <div className="flex justify-center items-center gap-4 mb-8 overflow-x-auto px-4">
            {steps.map((stepItem, index) => (
              <div key={index} className="flex flex-col items-center flex-shrink-0 text-center min-w-[80px]">
                <div className={`w-10 h-10 flex justify-center items-center rounded-full mb-1 ${
                  step >= index 
                    ? "bg-blue-600 text-white shadow-md" 
                    : "bg-gray-200 text-gray-500"
                }`}>
                  <stepItem.icon className="w-5 h-5" />
                </div>
                <div className={`text-sm font-medium ${
                  step >= index ? "text-blue-700" : "text-gray-500"
                }`}>
                  {stepItem.name}
                </div>
              </div>
            ))}
          </div>


          {/* Main Content Card */}
          <div className="bg-white shadow-2xl rounded-2xl overflow-hidden mb-8">
            <div className="p-8">
              {renderStepContent()}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center gap-4">
            <div>
              {step === 0 && (
                <button 
                  onClick={() => navigate('/my-courses')} 
                  className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md"
                >
                  {t("createCourse.buttons.backToCourses")}
                </button>
              )}
              {step > 0 && step < 3 && (
                <button 
                  onClick={() => setStep(step - 1)} 
                  className="px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md"
                >
                  {t("createCourse.buttons.back")}
                </button>
              )}
            </div>
            
            <div>
              {step === 2 && (
                <button 
                  onClick={GenerateCourseLayout} 
                  disabled={generatingCourse}
                  className={`px-6 py-3 rounded-full font-medium flex items-center gap-2 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md ${
                    generatingCourse 
                      ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {generatingCourse ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {t("createCourse.buttons.generating")}
                    </>
                  ) : (
                    t("createCourse.buttons.generate")
                  )}
                </button>
              )}
              
              {step === 3 && (
                <button 
                  onClick={GenerateChapterContent} 
                  disabled={generatingChapters}
                  className={`px-6 py-3 rounded-full font-medium flex items-center gap-2 transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md ${
                    !generatingChapters
                      ? "bg-green-600 hover:bg-green-700 text-white" 
                      : "bg-green-300 text-green-600 cursor-not-allowed"
                  }`}
                >
                  {generatingChapters ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {t("createCourse.buttons.finalizing")}
                    </>
                  ) : (
                    t("createCourse.buttons.finish")
                  )}
                </button>
              )}
              
              {(step === 0 || step === 1) && (
                <button 
                  onClick={() => setStep(step + 1)} 
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md ${
                    isNextEnabled()
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                  disabled={!isNextEnabled()}
                >
                  {t("createCourse.buttons.next")}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCourse;