import axiosInstance from "@/shared/api/axios.config";
import type { LogInResponse } from "../interfaces/responses.dto";

export const LogIn = async (email: string, password: string) => {
  const response = await axiosInstance.post<LogInResponse>("/usuarios/login", {
    correo: email,
    contrasena: password,
  });
  return response.data;
};
