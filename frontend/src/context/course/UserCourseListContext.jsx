import { createContext } from "react";

export const UserCourseListContext = createContext({
  userCourseList: [],
  setUserCourseList: () => {}
});
