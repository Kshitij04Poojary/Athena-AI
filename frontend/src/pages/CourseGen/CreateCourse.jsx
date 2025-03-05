import React, { useState } from "react";
import { FaWandMagicSparkles } from "react-icons/fa6";
import { HiOutlineSquare3Stack3D } from "react-icons/hi2";
import { FiTarget } from "react-icons/fi";
import { IoMdOptions } from "react-icons/io";
import skillList from "../../data/skillList";
import axios from 'axios';
import { useUser } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';

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
  
  // New state for terms agreement
  const [isTermsAgreed, setIsTermsAgreed] = useState(false);
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
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/generate-course", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, skills }),
      });
  
      if (!response.ok) throw new Error("Failed to fetch course layout");
  
      const data = await response.json();
      console.log("Generated course:", data);
      
      setApiResponse(data);
      setStep(3);
      // Reset terms agreement when moving to step 3
      setIsTermsAgreed(false);
    } catch (error) {
      console.error("Course generation failed:", error);
      alert("Error generating course. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const GenerateChapterContent = async () => {
    setLoading(true);
    try {
        if (!apiResponse.courseLayout || !apiResponse.courseLayout.Chapters?.length) {
            alert("Please generate a course with chapters first.");
            setLoading(false);
            return;
        }

        const course = apiResponse.courseLayout;
        console.log("Generating chapters for course:", course);

        const difficulty = course.Level;
        const updatedCourse = { ...course, Chapters: [...course.Chapters] };

        for (let i = 0; i < updatedCourse.Chapters.length; i++) {
            const chapter = updatedCourse.Chapters[i];

            const chapterPayload = {
                chapterName: chapter["Chapter Name"],
                about: chapter["About"],
                duration: chapter["Duration"],
                content: chapter["Content"],
                difficulty: difficulty,
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
                    video: video ?? { url: null, thumbnail: null },  // Ensure both url and thumbnail exist
                };
            } catch (chapterError) {
                console.error(`Error generating content for chapter "${chapter["Chapter Name"]}":`, chapterError);
                alert(`Failed to generate content for chapter "${chapter["Chapter Name"]}". Skipping this chapter.`);
                // Optional: you could set a 'generationFailed' flag on the chapter if you want to display it in UI
                updatedCourse.Chapters[i] = {
                    ...chapter,
                    sections: [],
                    video: { url: null, thumbnail: null },
                };
            }
        }

        console.log("Updated course with sections and videos:", updatedCourse);
        alert("Course content generated successfully!");

        const token = user?.token;
        if (!token) {
            console.error("No token found. Log in again");
            alert("Session expired or you're not logged in. Please log in again.");
            return;
        }

        // ✅ Transform function to match backend's expected camelCase schema
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
                video: chapter.video ?? { url: null, thumbnail: null },  // Ensure video structure is consistent
                isCompleted: chapter.isCompleted ?? false
            }))
        });

        const finalCourse = transformCourse(updatedCourse);
        console.log("Final course:", finalCourse);

        try {
            const response = await axios.post(
                'http://localhost:8000/api/courses/create-courses',
                finalCourse,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            console.log("Course created successfully:", response.data);
            const courseId = response.data?.course?._id;

            if (courseId) {
                navigate(`/course/${courseId}`);
            } else {
                alert("Course created, but unable to retrieve course ID.");
            }
        } catch (error) {
            console.error("Error creating course:", error);
            if (error.response?.status === 401) {
                alert("Session expired. Please log in again.");
            } else {
                alert("Failed to save course. Please try again.");
            }
        }

    } catch (error) {
        console.error("Course generation failed:", error);
        alert("Error generating course. Please try again.");
    } finally {
        setLoading(false);
    }
};


  return (
    <div className="flex">
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

        <div className="bg-white p-6 rounded shadow-md">
          {step < 3 && (
            <>
              {step === 0 && (
                <div>
                  <h3 className="text-xl font-semibold">Select Skills</h3>
                  <input
                    type="text"
                    placeholder="Add skill"
                    className="mt-2 p-2 border rounded w-full"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    list="skillSuggestions"
                  />
                  <datalist id="skillSuggestions">
                    {skillList.filter(skill => skill.toLowerCase().includes(skillInput.toLowerCase())).map(skill => (
                      <option key={skill} value={skill} />
                    ))}
                  </datalist>
                  <button
                    className="mt-2 p-2 bg-purple-600 text-white rounded"
                    disabled={!skillInput.trim()}
                    onClick={addSkill}
                  >
                    Add Skill
                  </button>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {skills.map(skill => (
                      <div key={skill} className="bg-purple-200 px-2 py-1 rounded flex items-center">
                        {skill}
                        <button className="ml-2 text-red-600" onClick={() => removeSkill(skill)}>x</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {step === 1 && (
                <div>
                  <h3 className="text-xl font-semibold">Topic & Description</h3>
                  <input
                    type="text"
                    placeholder="Topic"
                    className="mt-2 p-2 border rounded w-full"
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  />
                  <textarea
                    placeholder="Description"
                    className="mt-2 p-2 border rounded w-full"
                    rows="3"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              )}

              {step === 2 && (
                <div>
                  <h3 className="text-xl font-semibold">Options</h3>
                  <select
                    className="mt-2 p-2 border rounded w-full"
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
                    className="mt-2 p-2 border rounded w-full"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  />
                  <input
                    type="number"
                    placeholder="No. of Chapters (1-5)"
                    className="mt-2 p-2 border rounded w-full"
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
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-purple-600">{course["Course Name"]}</h3>
                    
                    <div className="bg-gray-50 p-4 rounded">
                      <p className="text-gray-700 mb-2"><strong>Description:</strong> {course.Description}</p>
                      
                      <div className="mb-2">
                        <strong>Skills:</strong>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {course.Skills.map((skill, skillIdx) => (
                            <span key={skillIdx} className="bg-purple-200 px-2 py-1 rounded text-sm">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <p><strong>Level:</strong> {course.Level}</p>
                      <p><strong>Duration:</strong> {course.Duration}</p>
                      <p><strong>Number of Chapters:</strong> {course.NoOfChapters}</p>
                      
                      <div className="mt-4">
                        <strong>Course Outcomes:</strong>
                        <ul className="list-disc list-inside">
                          {course["Course Outcomes"].map((outcome, outcomeIdx) => (
                            <li key={outcomeIdx} className="text-gray-700">{outcome}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <h4 className="text-xl font-semibold mb-2">Chapters</h4>
                      {course.Chapters.map((chapter, chapterIdx) => (
                        <div key={chapterIdx} className="bg-white border rounded p-3 mb-3">
                          <h5 className="text-lg font-medium text-purple-500">{chapter["Chapter Name"]}</h5>
                          <p className="text-gray-600 mb-2">{chapter.About}</p>
                          <p><strong>Duration:</strong> {chapter.Duration}</p>
                          <div className="mt-2">
                            <strong>Chapter Content:</strong>
                            <ul className="list-disc list-inside">
                              {chapter.Content.map((item, contentIdx) => (
                                <li key={contentIdx}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Terms Agreement Section */}
                    <div className="mt-4 bg-gray-100 p-4 rounded">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="terms-agreement"
                          checked={isTermsAgreed}
                          onChange={() => setIsTermsAgreed(!isTermsAgreed)}
                          className="mr-2"
                        />
                        <label htmlFor="terms-agreement" className="text-gray-700">
                          I understand that once the course is finalized, it cannot be deleted or edited
                        </label>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-between">
          {step === 0 && <button onClick={() => navigate('/my-courses')} className="p-2 bg-black text-white rounded cursor pointer">Back to My Courses</button>}
          {step > 0 && <button onClick={() => setStep(step - 1)} className="p-2 bg-gray-300 rounded">Back</button>}
          {step === 2
            ? <button onClick={GenerateCourseLayout} className="p-2 bg-black text-white rounded">Generate</button>
            : step === 3
              ? <button 
                  onClick={GenerateChapterContent} 
                  disabled={!isTermsAgreed}
                  className={`p-2 rounded ${
                    isTermsAgreed 
                      ? "bg-green-600 text-white" 
                      : "bg-green-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Finish
                </button>
              : <button onClick={() => setStep(step + 1)} className="p-2 bg-black text-white rounded" disabled={!isNextEnabled()}>Next</button>}
        </div>
      </div>
    </div>
  );
};

export default CreateCourse;