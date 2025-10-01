/* O que são: mecanismo do React para compartilhar dados entre componentes sem precisar passar props manualmente em cada nível da árvore.

Exemplos comuns:
AuthContext → guarda token e info do usuário logado.
*/

import React, { createContext, useState, ReactNode, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User, AuthResponse, LoginData, RegisterData, AuthContextData } from "../types/User";
import { loginUser, registerUser } from "../services/authService";


export const AuthContext = createContext<AuthContextData>({
  user: null,
  token: null,
  register: async () => null,
  login: async () => null,
  logout: async () => { },
  setUser: () => { },
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthResponse | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Persistência
  useEffect(() => {
    const loadUser = async () => {
      const storedToken = await AsyncStorage.getItem("token");
      const storedUser = await AsyncStorage.getItem("user");
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    };
    loadUser();
  }, []);

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
      const res: AuthResponse = await loginUser(data); // já guarda tokens internamente

      const userData = {
        ...res,
        name: res.name,
        currentXp: res.currentXp ?? 0,
        level: res.level ?? 1,
        pendingAchievements: res.unlockedAchievements ?? [],
      };

      // AsyncStorage já foi atualizado no loginUser, só falta o user
      await AsyncStorage.setItem("user", JSON.stringify(userData));

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
    await AsyncStorage.removeItem("refreshToken"); // ✅
    await AsyncStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, token, register, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
