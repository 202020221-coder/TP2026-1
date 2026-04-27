export const openMaintenancePdfUrl = (url: string) => {
  const trimmed = url.trim();
  if (!trimmed) {
    return;
  }
  window.open(trimmed, "_blank", "noopener,noreferrer");
};

const suggestedFileName = (url: string) => {
  try {
    const path = new URL(url, window.location.origin).pathname;
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
  const trimmed = url.trim();
  if (!trimmed) {
    return;
  }

  const name = suggestedFileName(trimmed);

  try {
    const res = await fetch(trimmed);
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
    openMaintenancePdfUrl(trimmed);
  }
};
