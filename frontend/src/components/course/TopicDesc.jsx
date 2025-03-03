import React, { useContext } from "react";
import { UserInputContext } from "../../context/course/UserInputContext";

const TopicDesc = () => {
  const { userInput, setUserInput } = useContext(UserInputContext);

  const handleInputChange = (fieldName, value) => {
    setUserInput((prev) => ({ ...prev, [fieldName]: value }));
  };

  return (
    <div className="mx-20 lg:mx-44">
      <div className="mt-5">
        <label className="block text-sm font-medium text-gray-700">
          Write the Topic for which you want to generate a course
        </label>
        <input
          type="text"
          placeholder="Enter the topic"
          defaultValue={userInput?.topic}
          onChange={(e) => handleInputChange("topic", e.target.value)}
          className="mt-1 w-full border rounded-md px-3 py-2"
        />
      </div>

      <div className="mt-5">
        <label className="block text-sm font-medium text-gray-700">
          Tell us more about your course, what you want to include in the course.
        </label>
        <textarea
          placeholder="About your course"
          defaultValue={userInput?.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          className="mt-1 w-full border rounded-md px-3 py-2"
        />
      </div>
    </div>
  );
};

export default TopicDesc;
