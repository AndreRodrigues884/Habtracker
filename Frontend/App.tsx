import React from "react";
import { AuthProvider } from "./src/contexts/AuthContext";
import { Router } from "./src/routes/router";
import { FontProvider } from './src/contexts/FontProvider';
import { AchievementModalProvider } from './src/contexts/AchievementModalContext';
import { ThemeProvider } from './src/contexts/ThemeContext';
// Initialize Axios interceptors (auth token + refresh flow)
import "./src/services/axiosInterceptors";

export default function App() {
return (
    <FontProvider>
      <ThemeProvider>
        <AuthProvider>
          <AchievementModalProvider>
            <Router />
          </AchievementModalProvider>
        </AuthProvider>
      </ThemeProvider>
    </FontProvider>
  );
}
