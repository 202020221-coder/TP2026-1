// src/lib/axios.ts
import { useSession } from "@/profile/hooks/stores/useSession.store";
import axios from "axios";
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 6000,
  headers: {
    "X-Requested-With": "XMLHttpRequest",
  },
  responseType: "json",
  responseEncoding: "utf8",
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  decompress: true,
  paramsSerializer: {
    indexes: false,
  },
  validateStatus: (status) => status >= 200 && status < 300,
});

// Agregar interceptor para incluir el token de acceso
axiosInstance.interceptors.request.use(
  (config) => {
    // Obtener el token desde donde lo tengas guardado (localStorage, cookies, store, etc.)
    const { accessToken } = useSession.getState();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default axiosInstance;
