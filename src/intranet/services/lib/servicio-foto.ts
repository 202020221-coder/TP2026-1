// Base completa del API (incluye el prefijo de ruta, p. ej. ".../api").
// Las imágenes del backend se sirven bajo esa base (p. ej. /api/uploads/...),
// por lo que NO se debe descartar el path quedándose solo con el origin.
const getApiBase = () => {
  const baseUrl = import.meta.env.VITE_API_URL;
  if (typeof baseUrl === "string" && baseUrl.trim().length > 0) {
    return baseUrl.trim().replace(/\/+$/, "");
  }
  return window.location.origin;
};

/** Convierte una ruta/URL de foto del backend en una URL absoluta utilizable en <img>. */
export function resolveServicioFotoUrl(url: string | null | undefined): string {
  const trimmed = (url ?? "").trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const base = getApiBase();
  return trimmed.startsWith("/") ? `${base}${trimmed}` : `${base}/${trimmed}`;
}

export const SERVICIO_FOTO_ACCEPT = "image/jpeg,image/png,image/webp,image/gif";
export const SERVICIO_FOTO_MAX_BYTES = 5 * 1024 * 1024;

export function validateServicioFotoFile(file: File): string | null {
  if (!file.type.startsWith("image/")) {
    const ext = file.name.split(".").pop()?.toLowerCase();
    const allowed = ["jpg", "jpeg", "png", "webp", "gif"];
    if (!ext || !allowed.includes(ext)) {
      return "Solo se permiten imágenes (JPG, PNG, WEBP o GIF).";
    }
  }
  if (file.size > SERVICIO_FOTO_MAX_BYTES) {
    return "La imagen no debe superar 5 MB.";
  }
  return null;
}
