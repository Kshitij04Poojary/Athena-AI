import React, { useState } from "react";
import { FaWandMagicSparkles } from "react-icons/fa6";
import { HiOutlineSquare3Stack3D } from "react-icons/hi2";
import { FiTarget } from "react-icons/fi";
import { IoMdOptions } from "react-icons/io";
import SideBar from "../../components/SideBar";

// Stepper Configuration
const steps = [
  { id: 1, name: "Category", icon: HiOutlineSquare3Stack3D },
  { id: 2, name: "Topic and Description", icon: FiTarget },
  { id: 3, name: "Options", icon: IoMdOptions }
];

const CreateCourseProxy = () => {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    category: "",
    topic: "",
    description: "",
    difficulty: "",
    duration: ""
  });

  // Checks if "Next" button should be enabled
  const isNextEnabled = () => {
    if (step === 0) return formData.category.length > 0;
    if (step === 1) return formData.topic && formData.description;
    if (step === 2) return formData.difficulty && formData.duration;
    return false;
  };

  return (
    <div className="flex">
    <SideBar/>
    <div className="p-6 w-lg min-h-lvh mx-40 my-40 min-w-2xl">
      <h2 className="text-3xl font-bold text-purple-600 text-center mb-6">Create Course</h2>

      {/* Stepper */}
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

      {/* Step Content */}
      <div className="bg-white p-6 rounded shadow-md">
        {step === 0 && (
          <div>
            <h3 className="text-xl font-semibold">Select Category</h3>
            <select 
              className="mt-2 p-2 border rounded w-full" 
              value={formData.category} 
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="">Select...</option>
              <option value="Programming">Programming</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Science">Science</option>
            </select>
          </div>
        )}
        
        {step === 1 && (
          <div>
            <h3 className="text-xl font-semibold">Topic & Description</h3>
            <input 
              type="text" 
              placeholder="Enter Topic" 
              className="mt-2 p-2 border rounded w-full" 
              value={formData.topic} 
              onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
            />
            <textarea 
              placeholder="Enter Description" 
              className="mt-2 p-2 border rounded w-full" 
              rows="3"
              value={formData.description} 
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
        )}
        
        {step === 2 && (
          <div>
            <h3 className="text-xl font-semibold">Course Options</h3>
            <select 
              className="mt-2 p-2 border rounded w-full" 
              value={formData.difficulty} 
              onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
            >
              <option value="">Select Difficulty</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
            <input 
              type="text" 
              placeholder="Course Duration (e.g., 2 Hours)" 
              className="mt-2 p-2 border rounded w-full" 
              value={formData.duration} 
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            />
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="mt-6 flex justify-between">
        <button
          disabled={step === 0}
          onClick={() => setStep((prev) => prev - 1)}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Previous
        </button>
        {step < steps.length - 1 ? (
          <button
            disabled={!isNextEnabled()}
            onClick={() => setStep((prev) => prev + 1)}
            className="px-4 py-2 !bg-black !text-white rounded disabled:opacity-50"
          >
            Next
          </button>
        ) : (
          <button
            onClick={() => alert("Course generation logic goes here.")}
            className="px-4 py-2 !bg-black !text-white rounded flex items-center gap-2"
          >
            <FaWandMagicSparkles /> Generate Course
          </button>
        )}
      </div>

      {/* Loading Indicator (For UI Only) */}
      {loading && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="p-4 bg-white rounded">Loading...</div>
        </div>
      )}
    </div>
    </div>
  );
};

export default CreateCourseProxy;
