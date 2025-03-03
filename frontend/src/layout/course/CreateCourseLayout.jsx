import React, { useState } from "react";
import { UserInputContext } from "../../context/course/UserInputContext";
import { UserCourseListContext } from "../../context/course/UserCourseListContext";

const CreateCourseLayout = ({ children }) => {
  const [userInput, setUserInput] = useState({});
  const [userCourseList, setUserCourseList] = useState([]);

  return (
    <UserInputContext.Provider value={{ userInput, setUserInput }}>
      <UserCourseListContext.Provider value={{ userCourseList, setUserCourseList }}>
        {children}
      </UserCourseListContext.Provider>
    </UserInputContext.Provider>
  );
};

export default CreateCourseLayout;
