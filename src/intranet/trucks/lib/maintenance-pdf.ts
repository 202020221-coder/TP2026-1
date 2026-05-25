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

export const resolveBackendFileUrl = (url: string) => {
  const trimmed = url.trim();
  if (!trimmed) {
    return "";
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  const origin = getApiOrigin();
  if (trimmed.startsWith("/")) {
    return `${origin}${trimmed}`;
  }

  return `${origin}/${trimmed}`;
};

export const openMaintenancePdfUrl = (url: string) => {
  const resolved = resolveBackendFileUrl(url);
  if (!resolved) {
    return;
  }
  window.open(resolved, "_blank", "noopener,noreferrer");
};

const suggestedFileName = (url: string) => {
  try {
    const path = new URL(resolveBackendFileUrl(url), window.location.origin).pathname;
    const last = path.split("/").pop() ?? "";
    const base = decodeURIComponent(last.split("?")[0] ?? "");
    if (base && /\.pdf$/i.test(base)) {
      return base;
    }
  } catch {
    const last = url.split("/").pop()?.split("?")[0] ?? "";
    if (last && /\.pdf$/i.test(last)) {
      return decodeURIComponent(last);
    }
  }
  return "mantenimiento.pdf";
};

export const downloadMaintenancePdfUrl = async (url: string) => {
  const resolved = resolveBackendFileUrl(url);
  if (!resolved) {
    return;
  }

  const name = suggestedFileName(resolved);

  try {
    const res = await fetch(resolved);
    if (!res.ok) {
      throw new Error("Respuesta no OK");
    }
    const blob = await res.blob();
    const objUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = objUrl;
    a.download = name;
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(objUrl);
  } catch {
    openMaintenancePdfUrl(resolved);
  }
};
