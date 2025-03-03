import { createContext } from "react";

export const UserInputContext = createContext({
  userInput: {},
  setUserInput: () => {}
});
