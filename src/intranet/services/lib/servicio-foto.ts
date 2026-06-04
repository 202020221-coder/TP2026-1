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
