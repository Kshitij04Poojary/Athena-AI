import React, { useState } from "react";
import { FaWandMagicSparkles } from "react-icons/fa6";
import { HiOutlineSquare3Stack3D } from "react-icons/hi2";
import { FiTarget } from "react-icons/fi";
import { IoMdOptions } from "react-icons/io";
import skillList from "../../data/skillList";
import axios from 'axios';
import { useUser } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const steps = [
  { id: 1, name: "Skills", icon: HiOutlineSquare3Stack3D },
  { id: 2, name: "Topic and Description", icon: FiTarget },
  { id: 3, name: "Options", icon: IoMdOptions },
  { id: 4, name: "Generated Course", icon: FaWandMagicSparkles },
];

const CreateCourse = () => {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [apiResponse, setApiResponse] = useState({ courseLayout: [] });
  const [generatingCourse, setGeneratingCourse] = useState(false);
  const [generatingChapters, setGeneratingChapters] = useState(false);

  const { user } = useUser();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    topic: "",
    description: "",
    difficulty: "",
    duration: "",
    noOfChp: "",
  });

  const addSkill = () => {
    const trimmedSkill = skillInput.trim();
    if (trimmedSkill && !skills.includes(trimmedSkill)) {
      setSkills([...skills, trimmedSkill]);
      setSkillInput("");
    }
  };

  const removeSkill = (skill) => setSkills(skills.filter((s) => s !== skill));

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
      const response = await fetch("http://localhost:8000/api/generate-course", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, skills }),
      });
  
      if (!response.ok) throw new Error("Failed to fetch course layout");
  
      const data = await response.json();
      setApiResponse(data);
      setStep(3);
      toast.success('Course layout generated successfully!');
    } catch (error) {
      console.error("Course generation failed:", error);
      toast.error('Error generating course. Please try again.');
    } finally {
      setGeneratingCourse(false);
    }
  };

  const GenerateChapterContent = async () => {
    setGeneratingChapters(true);
    try {
        if (!apiResponse.courseLayout || !apiResponse.courseLayout.Chapters?.length) {
            toast.error("Please generate a course with chapters first.");
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
                const chapterResponse = await fetch("http://localhost:8000/api/generate-chapter-content", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(chapterPayload),
                });

                if (!chapterResponse.ok) {
                    throw new Error(`Failed to fetch content for chapter: ${chapter["Chapter Name"]}`);
                }

                const { sections, video } = await chapterResponse.json();

                updatedCourse.Chapters[i] = {
                    ...chapter,
                    sections,
                    video: video ?? { url: null, thumbnail: null },
                };
            } catch (chapterError) {
                console.error(`Error generating content for chapter "${chapter["Chapter Name"]}":`, chapterError);
                toast.warning(`Failed to generate content for chapter "${chapter["Chapter Name"]}". Skipping this chapter.`);
                updatedCourse.Chapters[i] = {
                    ...chapter,
                    sections: [],
                    video: { url: null, thumbnail: null },
                };
            }
        }

        const token = user?.token;
        if (!token) {
            toast.error("Session expired or you're not logged in. Please log in again.");
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
                'http://localhost:8000/api/courses/create-courses',
                finalCourse,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            toast.success("Course created successfully!");
            const courseId = response.data?.course?._id;

            if (courseId) {
                if (user?.userType === 'Mentor') {
                    await createAssignedCourseForMentor(courseId);
                }

                navigate(`/course/${courseId}`);
            } else {
                toast.error("Course created, but unable to retrieve course ID.");
            }
        } catch (error) {
            console.error("Error creating course:", error);
            if (error.response?.status === 401) {
                toast.error("Session expired. Please log in again.");
            } else {
                toast.error("Failed to save course. Please try again.");
            }
        }

    } catch (error) {
        console.error("Course generation failed:", error);
        toast.error("Error generating course. Please try again.");
    } finally {
        setGeneratingChapters(false);
    }
};

// Function to create assigned course for mentor
const createAssignedCourseForMentor = async (courseId) => {
    try {
        const assignedCoursePayload = {
            mentor: user._id,  // Assuming user object has _id
            assigns: [],       // No mentees initially
            orgCourseId: courseId,
            dueDate: null      // You can change this if you want to set a default
        };

        await axios.post('http://localhost:8000/api/assigned/', assignedCoursePayload);

        toast.success("Assigned course created for mentor.");
    } catch (error) {
        console.error("Failed to create assigned course for mentor:", error);
        toast.error("Failed to create assigned course for mentor.");
    }
};

  return (
    <div className="flex">
    <Toaster position="top-right" richColors />
      <div className="p-6 w-lg min-h-lvh mx-40 my-40 min-w-2xl">
        <h2 className="text-3xl font-bold text-purple-600 text-center mb-6">Create Course</h2>

        <div className="flex justify-center items-center gap-4 mb-8">
          {steps.map((stepItem, index) => (
            <div key={index} className="flex items-center">
              <div className={`w-10 h-10 flex justify-center items-center rounded-full ${step >= index ? "bg-purple-600 text-white" : "bg-gray-300"}`}>
                <stepItem.icon />
              </div>
              {index < steps.length - 1 && <div className={`w-16 h-1 ${step > index ? "bg-purple-600" : "bg-gray-300"}`} />}
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-xl shadow-lg">
  {step < 3 && (
    <>
      {step === 0 && (
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-purple-800 mb-4">Select Skills</h3>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Add skill"
              className="flex-grow p-3 border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              list="skillSuggestions"
            />
            <button
              className="bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 transition duration-300"
              disabled={!skillInput.trim()}
              onClick={addSkill}
            >
              Add Skill
            </button>
          </div>
          <datalist id="skillSuggestions">
            {skillList.filter(skill => skill.toLowerCase().includes(skillInput.toLowerCase())).map(skill => (
              <option key={skill} value={skill} />
            ))}
          </datalist>
          <div className="flex flex-wrap gap-2 mt-4">
            {skills.map(skill => (
              <div 
                key={skill} 
                className="bg-purple-200 px-3 py-1 rounded-full flex items-center space-x-2 text-purple-800"
              >
                <span>{skill}</span>
                <button 
                  className="text-red-500 hover:text-red-700 transition" 
                  onClick={() => removeSkill(skill)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-purple-800 mb-4">Topic & Description</h3>
          <input
            type="text"
            placeholder="Topic"
            className="w-full p-3 border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
            value={formData.topic}
            onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
          />
          <textarea
            placeholder="Description"
            className="w-full p-3 border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
            rows="4"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-purple-800 mb-4">Options</h3>
          <select
            className="w-full p-3 border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
            value={formData.difficulty}
            onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
          >
            <option value="">Select Difficulty</option>
            <option>Basic</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
          <input
            type="text"
            placeholder="Duration"
            className="w-full p-3 border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
          />
          <input
            type="number"
            placeholder="No. of Chapters (1-5)"
            className="w-full p-3 border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300"
            value={formData.noOfChp}
            min={1}
            max={5}
            onChange={(e) => setFormData({ ...formData, noOfChp: Number(e.target.value) })}
          />
        </div>
      )}
    </>
  )}

  {step === 3 && apiResponse.courseLayout && Object.keys(apiResponse.courseLayout).length > 0 && (
    <div>
      {(() => {
        const course = apiResponse.courseLayout;
        return (
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-purple-700">{course["Course Name"]}</h3>
            
            <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
              <p className="text-gray-700 mb-4"><strong>Description:</strong> {course.Description}</p>
              
              <div className="mb-4">
                <strong className="block mb-2">Skills:</strong>
                <div className="flex flex-wrap gap-2">
                  {course.Skills.map((skill, skillIdx) => (
                    <span 
                      key={skillIdx} 
                      className="bg-purple-200 px-3 py-1 rounded-full text-purple-800 text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-gray-700">
                <p><strong>Level:</strong> {course.Level}</p>
                <p><strong>Duration:</strong> {course.Duration}</p>
                <p><strong>Number of Chapters:</strong> {course.NoOfChapters}</p>
              </div>
              
              <div className="mt-4">
                <strong className="block mb-2">Course Outcomes:</strong>
                <ul className="list-disc list-inside space-y-1">
                  {course["Course Outcomes"].map((outcome, outcomeIdx) => (
                    <li key={outcomeIdx} className="text-gray-700">{outcome}</li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div>
              <h4 className="text-2xl font-semibold mb-4 text-purple-700">Chapters</h4>
              {course.Chapters.map((chapter, chapterIdx) => (
                <div 
                  key={chapterIdx} 
                  className="bg-white border border-purple-100 rounded-xl p-5 mb-4 shadow-sm hover:shadow-md transition"
                >
                  <h5 className="text-xl font-semibold text-purple-600 mb-2">{chapter["Chapter Name"]}</h5>
                  <p className="text-gray-600 mb-3">{chapter.About}</p>
                  <p className="mb-2"><strong>Duration:</strong> {chapter.Duration}</p>
                  <div>
                    <strong className="block mb-2">Chapter Content:</strong>
                    <ul className="list-disc list-inside space-y-1">
                      {chapter.Content.map((item, contentIdx) => (
                        <li key={contentIdx} className="text-gray-700">{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}
    </div>
  )}
</div>

        <div className="mt-6 flex justify-between items-center">
          {step === 0 && <button onClick={() => navigate('/my-courses')} className="p-2 bg-black text-white rounded cursor-pointer">Back to My Courses</button>}
          {step > 0 && <button onClick={() => setStep(step - 1)} className="p-2 bg-gray-300 rounded">Back</button>}
          
          {step === 2 && (
            <button 
              onClick={GenerateCourseLayout} 
              disabled={generatingCourse}
              className={`p-2 bg-black text-white rounded flex items-center ${generatingCourse ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {generatingCourse ? (
                <>
                  <Loader2 className="mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate'
              )}
            </button>
          )}
          
          {step === 3 && (
            <button 
              onClick={GenerateChapterContent} 
              disabled={generatingChapters}
              className={`p-2 rounded flex items-center ${
                !generatingChapters
                  ? "bg-green-600 text-white" 
                  : "bg-green-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {generatingChapters ? (
                <>
                  <Loader2 className="mr-2 animate-spin" />
                  Finalizing...
                </>
              ) : (
                'Finish'
              )}
            </button>
          )}
          
          {(step === 0 || step === 1) && (
            <button 
              onClick={() => setStep(step + 1)} 
              className="p-2 bg-black text-white rounded" 
              disabled={!isNextEnabled()}
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateCourse;