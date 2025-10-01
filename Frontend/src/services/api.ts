import axios from "axios";
import Constants from "expo-constants";

function getBaseURL() {
  // Expo SDK 49+ usa `expoConfig`
  const hostUri =
    Constants.expoConfig?.hostUri || Constants.manifest?.debuggerHost;

  if (hostUri) {
    const ip = hostUri.split(":")[0]; // extrai o IP da máquina
    return `http://${ip}:3000`;
  }

  // 👉 fallback: em produção usa sempre URL do backend real (se tiveres deploy)
  return "http://192.168.1.5:3000";// IP fixo da tua máquina (caso falhe a deteção)
}

const api = axios.create({
  baseURL: getBaseURL(),
});

export default api;
