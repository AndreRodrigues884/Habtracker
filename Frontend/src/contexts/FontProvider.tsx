// src/contexts/FontContext.tsx
import React, { createContext, ReactNode } from "react";
import { useFontLoader } from "../hooks/useFontLoader";

export const FontContext = createContext({ fontsLoaded: false });

export const FontProvider = ({ children }: { children: ReactNode }) => {
  const { fontsLoaded } = useFontLoader();

  if (!fontsLoaded) return null;

  return (
    <FontContext.Provider value={{ fontsLoaded }}>
      {children}
    </FontContext.Provider>
  );
};
