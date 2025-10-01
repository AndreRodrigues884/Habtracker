// services/authService.ts
import api from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RegisterData, LoginData, AuthResponse } from "../types/User";
import { jwtDecode } from 'jwt-decode';

interface TokenPayload {
  userId: string;
  type: string;
  exp: number;
  iat: number;
}

export const registerUser = async (data: RegisterData): Promise<AuthResponse> => {
  const res = await api.post("/habtracker/users/register", data);
  return res.data;
};

export const loginUser = async (data: LoginData): Promise<AuthResponse> => {
  const res = await api.post("/habtracker/users/login", data);

  const { token, refreshToken, ...rest } = res.data;

  // Salva ambos os tokens
  await AsyncStorage.setItem("token", token);
  await AsyncStorage.setItem("refreshToken", refreshToken);

  return { token, refreshToken, ...rest };
};

// Verifica se o token está prestes a expirar (menos de 5 minutos)
export const isTokenExpiring = async (): Promise<boolean> => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) return true;

    const decoded = jwtDecode<TokenPayload>(token);
    const now = Date.now() / 1000;
    
    // Retorna true se faltar menos de 5 minutos para expirar
    return decoded.exp - now < 300;
  } catch (err) {
    console.error("Erro ao verificar expiração do token:", err);
    return true;
  }
};

export const refreshToken = async (): Promise<string | null> => {
  try {
    const refreshToken = await AsyncStorage.getItem("refreshToken");
    if (!refreshToken) return null;

    // Backend espera o refresh no body, não no header
    const res = await api.post("/habtracker/users/refresh", { refreshToken });

    const newToken = res.data.token;
    await AsyncStorage.setItem("token", newToken);

    // Se o backend também devolver novo refresh, atualiza
    if (res.data.refreshToken) {
      await AsyncStorage.setItem("refreshToken", res.data.refreshToken);
    }

    return newToken;
  } catch (err) {
    console.error("Erro ao atualizar token:", err);

    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("refreshToken");
    await AsyncStorage.removeItem("user");

    return null;
  }
};
