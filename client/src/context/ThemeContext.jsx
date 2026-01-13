import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // 👇 MAGIC YAHAN HAI: State banne se pehle LocalStorage check hoga
  const [theme, setTheme] = useState(() => {
    // 1. Check karo agar pehle se koi theme saved hai
    const savedTheme = localStorage.getItem("portfolio-theme");

    // 2. Agar hai toh wahi return karo, nahi toh Default 'dark' rakho
    return savedTheme ? savedTheme : "dark";
  });

  // 👇 JAISE HI THEME CHANGE HO, USE SAVE KARO
  useEffect(() => {
    // Body par attribute lagao (CSS styling ke liye)
    document.body.setAttribute("data-theme", theme);

    // LocalStorage mein save karo (Permanent memory)
    localStorage.setItem("portfolio-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  return useContext(ThemeContext);
};
