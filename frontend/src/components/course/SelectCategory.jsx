import React, { useContext } from "react";
import { categoryList } from "../../context/course/categoryList";
import { UserInputContext } from "../../context/course/UserInputContext";

const SelectCategory = () => {
  const { userInput, setUserInput } = useContext(UserInputContext);

  const handleCategorySelect = (category) => {
    setUserInput((prev) => ({ ...prev, category }));
  };

  return (
    <div className="px-10 md:px-20">
      <h2 className="my-5">Select the course category</h2>

      <div className="grid grid-cols-3 gap-10">
        {categoryList.map((category, index) => (
          <div
            key={index}
            className={`flex flex-col p-5 border items-center rounded-xl hover:border-blue-500 hover:bg-blue-50 cursor-pointer ${
              userInput?.category === category.name ? "border-blue-500 bg-blue-50" : ""
            }`}
            onClick={() => handleCategorySelect(category.name)}
          >
            <div className="w-32 h-32 flex items-center justify-center">
              <img
                src={category.icon}
                alt={category.name}
                className="w-full h-full object-contain"
              />
            </div>
            <h2>{category.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectCategory;
