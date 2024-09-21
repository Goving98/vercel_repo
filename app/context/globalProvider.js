"use client";
import React, { createContext, useState, useContext } from "react";
import themes from "./themes";

export const GlobalContext = createContext();
export const GlobalUpdateContext = createContext();

export const GlobalProvider = ({ children }) => {
    const [selectedTheme, setSelectedTheme] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const theme = themes[selectedTheme];
    const updateTheme = (themeIndex) => {
      setSelectedTheme(themeIndex);
    };
    const allTasks = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get("/api/tasks");
  
        const sorted = res.data.sort((a, b) => {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });
  
        setTasks(sorted);
  
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
  
  
    return (
        <GlobalContext.Provider
          value={{
            theme,
          }}
        ><GlobalUpdateContext.Provider value={{ updateTheme }}>
            {children}
        </GlobalUpdateContext.Provider>
        </GlobalContext.Provider>
    );
}
export const useGlobalState = () => useContext(GlobalContext);
export const useGlobalUpdate = () => useContext(GlobalUpdateContext);