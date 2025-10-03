import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { theme as lightBase } from "../styles/theme";

type ThemeType = typeof lightBase;

// Function that creates a dark theme from the light theme
const buildDarkTheme = (base: ThemeType): ThemeType => {
  return {
    ...base,
    colors: {
      ...base.colors,
      background: "#0F1115",
      white: "#161A20",
      dark_text: "#E6E6E6",
      primary: base.colors.primary,
      secondary: base.colors.secondary,
      gray: "#2A2F36",
      red: base.colors.red,
    },
    borderColor: {
      ...base.borderColor,
      borderColor: "#2A2F36",
      borderSecondColor: "#3A4049",
      borderThirdColor: "#3A4049",
    },
  } as ThemeType;
};

interface ThemeContextValue {
  theme: ThemeType;
  isDark: boolean;
  toggleTheme: () => void;
}

// Creates the context
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);


// Provider of the theme that surrounds the application
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  const theme = useMemo(() => (isDark ? buildDarkTheme(lightBase) : lightBase), [isDark]);

  const toggleTheme = useCallback(() => setIsDark(prev => !prev), []);

  const value = useMemo(() => ({ theme, isDark, toggleTheme }), [theme, isDark, toggleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useThemeContext = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useThemeContext must be used within ThemeProvider");
  return ctx;
};


