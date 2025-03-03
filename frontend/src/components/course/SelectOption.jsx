import React, { useContext } from "react";
import { UserInputContext } from "../../context/course/UserInputContext";

const SelectOption = () => {
  const { userInput, setUserInput } = useContext(UserInputContext);

  const handleInputChange = (fieldName, value) => {
    setUserInput((prev) => ({ ...prev, [fieldName]: value }));
  };

  return (
    <div className="px-10 md:px-20 lg:px-44">
      <div className="grid grid-cols-2 gap-10">
        <div>
          <label className="text-sm">🎓 Difficulty Level</label>
          <select
            className="w-full mt-1 border rounded-md px-3 py-2"
            onChange={(e) => handleInputChange("difficulty", e.target.value)}
            value={userInput?.difficulty || ""}
          >
            <option value="">Select Level</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advance">Advance</option>
          </select>
        </div>

        <div>
          <label className="text-sm">⏳ Course Duration</label>
          <select
            className="w-full mt-1 border rounded-md px-3 py-2"
            onChange={(e) => handleInputChange("duration", e.target.value)}
            value={userInput?.duration || ""}
          >
            <option value="">Select Duration</option>
            <option value="1 Hour">1 Hour</option>
            <option value="2 Hours">2 Hours</option>
            <option value="More than 3 Hours">More than 3 Hours</option>
          </select>
        </div>

        <div>
          <label className="text-sm">🎥 Add Video</label>
          <select
            className="w-full mt-1 border rounded-md px-3 py-2"
            onChange={(e) => handleInputChange("video", e.target.value)}
            value={userInput?.video || ""}
          >
            <option value="">Select Option</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        <div>
          <label className="text-sm">📄 No. of Chapters</label>
          <input
            type="number"
            className="w-full mt-1 border rounded-md px-3 py-2"
            onChange={(e) => handleInputChange("totalChapters", e.target.value)}
            value={userInput?.totalChapters || ""}
          />
        </div>
      </div>
    </div>
  );
};

export default SelectOption;
