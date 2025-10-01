// services/apiInterceptor.ts
import api from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { isTokenExpiring, refreshToken } from "./authService";

// Interceptor de REQUEST - adiciona token e renova se necessário
api.interceptors.request.use(
  async (config) => {
    let token = await AsyncStorage.getItem("token");

    if (!token) return config;

    // Verifica se precisa renovar (só se estiver perto de expirar)
    const needsRefresh = await isTokenExpiring();
    if (needsRefresh) {
      const newToken = await refreshToken();
      if (newToken) {
        token = newToken;
      } else {
        // Refresh falhou, remove token inválido
        return config;
      }
    }

    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de RESPONSE - trata erros 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Se 401 e ainda não tentou fazer retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshToken();

        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        } else {
          // Refresh falhou, precisa fazer login novamente
          // Aqui podes emitir um evento ou usar navigation para redirecionar
          console.log('Token expirado - necessário novo login');
        }
      } catch (refreshError) {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('refreshToken'); // ✅
        await AsyncStorage.removeItem('user');
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);