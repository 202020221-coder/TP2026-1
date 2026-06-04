const getApiOrigin = () => {
  const baseUrl = import.meta.env.VITE_API_URL;
  if (typeof baseUrl === "string" && baseUrl.trim().length > 0) {
    try {
      return new URL(baseUrl).origin;
    } catch {
      try {
        return new URL(baseUrl, window.location.origin).origin;
      } catch {
        return window.location.origin;
      }
    }
  }
  return window.location.origin;
};

/** Convierte una ruta/URL de foto del backend en una URL absoluta utilizable en <img>. */
export function resolveServicioFotoUrl(url: string | null | undefined): string {
  const trimmed = (url ?? "").trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const origin = getApiOrigin();
  return trimmed.startsWith("/") ? `${origin}${trimmed}` : `${origin}/${trimmed}`;
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
