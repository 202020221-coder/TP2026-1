import axiosInstance from "@/shared/api/axios.config";

const getFileNameFromContentDisposition = (header?: string) => {
  if (!header) return "orden-compra.pdf";
  try {
    const match = /filename\*?=(?:UTF-8''|\")?([^;\"']+)/i.exec(header);
    if (match && match[1]) {
      return decodeURIComponent(match[1].trim().replace(/^["']|["']$/g, ""));
    }
  } catch {
    // fallthrough
  }
  return "orden-compra.pdf";
};

export const downloadPurchaseOrder = async (
  id: number | string,
): Promise<void> => {
  const response = await axiosInstance.get<ArrayBuffer>(`/cotizaciones/${id}/orden-compra`, {
    responseType: "arraybuffer",
    headers: {
      Accept: "application/pdf",
    },
  } as any);

  const contentType = response.headers["content-type"] ?? "application/pdf";
  const blob = new Blob([response.data], { type: contentType });
  const filename = getFileNameFromContentDisposition(
    response.headers["content-disposition"],
  );
  const objUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = objUrl;
  a.download = filename;
  a.rel = "noopener noreferrer";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(objUrl);
};

export const uploadPurchaseOrder = async (
  id: number | string,
  file: File,
): Promise<void> => {
  const form = new FormData();
  // The API spec names the binary field `orden_compra`
  form.append("orden_compra", file);

  await axiosInstance.post(`/cotizaciones/${id}/orden-compra`, form);
};
