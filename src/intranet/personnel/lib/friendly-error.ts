import axios from "axios";

/**
 * Turns an axios/unknown error into a user-friendly message.
 * Mirrors the helper used in `organizar-personal/components/daily-staff-panel.tsx`.
 */
export const friendlyError = (err: unknown, fallback: string): string => {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as
      | { message?: string; error?: string }
      | string
      | undefined;
    if (typeof data === "string" && data.trim()) return data;
    if (data && typeof data === "object") {
      if (data.message) return data.message;
      if (data.error) return data.error;
    }
    if (err.response?.status === 500) {
      return "El servidor no pudo procesar la solicitud. Verifica los datos e inténtalo de nuevo.";
    }
    if (err.code === "ECONNABORTED") {
      return "La solicitud tardó demasiado. Verifica tu conexión.";
    }
  }
  if (
    err instanceof Error &&
    err.message &&
    !err.message.startsWith("Request failed")
  ) {
    return err.message;
  }
  return fallback;
};
