import React, { useContext, useEffect, useState } from "react";
import SelectCategory from "../../components/course/SelectCategory";
import TopicDesc from "../../components/course/TopicDesc";
import SelectOption from "../../components/course/SelectOption";
import LoadingDialog from "../../components/course/LoadingDialog";

import { UserInputContext } from "../../context/course/UserInputContext";
import { UserCourseListContext } from "../../context/course/UserCourseListContext";
import { FaWandMagicSparkles } from "react-icons/fa6";
import { HiOutlineSquare3Stack3D } from "react-icons/hi2";
import { FiTarget } from "react-icons/fi";
import { IoMdOptions } from "react-icons/io";
//import { GenerateCourseLayout } from "../../../../backend/node/middleware/AIModel";

// Stepper options directly included
const stepperOptions = [
  {
    id: 1,
    name: "Category",
    icon: HiOutlineSquare3Stack3D,
  },
  {
    id: 2,
    name: "Topic and Desc",
    icon: FiTarget,
  },
  {
    id: 3,
    name: "Options",
    icon: IoMdOptions,
  },
];

const CreateCourse = () => {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const { userInput } = useContext(UserInputContext);
  const { userCourseList } = useContext(UserCourseListContext);

  const allowNextStep = () => {
    if (step === 0) return userInput?.category?.length > 0;
    if (step === 1) return userInput?.topic && userInput?.description;
    if (step === 2)
      return (
        userInput?.difficulty &&
        userInput?.duration &&
        userInput?.video &&
        userInput?.totalChapters
      );
    return false;
  };

  // const generateCourse = () => {
  //   const BASIC_PROMPT = 'Generate A Course Tutorial on Following Detail With field Course Name, Description, Along with Chapter Name, about, Duration: '
  //   const USER_INPUT_PROMPT = 'Category: "Programming", Topic: Python, Level: Basic, Duration: 1 hours, NoOf Chapters: 5, in JSON format.'
  //   const FINAL_PROMPT = BASIC_PROMPT + USER_INPUT_PROMPT
  //   //const result = await GenerateCourseLayout.sendMessage("INSERT_INPUT_HERE")
  //   alert("Course generation logic will go here.");
  // };

  useEffect(() => {
    if (userCourseList.length > 5) {
      alert("Redirect to upgrade page - logic can be added here.");
    }
  }, [userCourseList]);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-purple-600 text-center mb-6">
        Create Course
      </h2>

      {/* Stepper */}
      <div className="flex justify-center items-center gap-4 mb-8">
        {stepperOptions.map((option, index) => (
          <div key={index} className="flex items-center">
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-full ${
                step >= index ? "bg-purple-600 text-white" : "bg-gray-300"
              }`}
            >
              <option.icon />
            </div>
            {index !== stepperOptions.length - 1 && (
              <div
                className={`h-1 w-16 ${
                  step > index ? "bg-purple-600" : "bg-gray-300"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="bg-white p-6 shadow rounded-lg">
        {step === 0 && <SelectCategory />}
        {step === 1 && <TopicDesc />}
        {step === 2 && <SelectOption />}
      </div>

      {/* Buttons */}
      <div className="mt-6 flex justify-between">
        <button
          onClick={() => setStep(step - 1)}
          disabled={step === 0}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>
        {step === stepperOptions.length - 1 ? (
          <button
            onClick={generateCourse}
            disabled={!allowNextStep() || loading}
            className="px-4 py-2 bg-purple-600 text-white rounded flex items-center gap-2 disabled:opacity-50"
          >
            <FaWandMagicSparkles />
            Generate Course
          </button>
        ) : (
          <button
            onClick={() => setStep(step + 1)}
            disabled={!allowNextStep()}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            Next
          </button>
        )}
      </div>

      {/* Loading Dialog */}
      <LoadingDialog loading={loading} />
    </div>
  );
};

export default CreateCourse;
