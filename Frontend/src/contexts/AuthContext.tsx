import React, { createContext, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthResponse, LoginData, RegisterData, AuthContextData } from "../types/User";
import { loginUser, registerUser } from "../services/authService";
import { useAuthState } from "../hooks/useAuthState";


// Creates the authentication context with default values
export const AuthContext = createContext<AuthContextData>({
  user: null,
  token: null,
  register: async () => null,
  login: async () => null,
  logout: async () => { },
  setUser: () => { },
});

// Wraps the application and provides the context
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { user, setUser, token, setToken } = useAuthState();

  const register = async (data: RegisterData) => {
    try {
      await registerUser(data);
      return null;
    } catch (err: any) {
      return err.response?.data?.message || "Erro no registro";
    }
  };

  const login = async (data: LoginData) => {
    try {
      const res: AuthResponse = await loginUser(data);

      const userData = {
        ...res,
        name: res.name,
        currentXp: res.currentXp ?? 0,
        level: res.level ?? 1,
        pendingAchievements: res.unlockedAchievements ?? [],
      };

      await AsyncStorage.setItem("user", JSON.stringify(userData));

      // Update context with token and user
      setToken(res.token);
      setUser(userData);

      return null;
    } catch (err: any) {
      return err.response?.data?.message || "Erro no login";
    }
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("refreshToken"); 
    await AsyncStorage.removeItem("user");
  };

  // Returns context for the entire application
  return (
    <AuthContext.Provider value={{ user, token, register, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
