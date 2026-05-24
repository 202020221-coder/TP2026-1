import axiosInstance from "@/shared/api/axios.config";

export type UploadPurchaseOrderResponse = {
  message: string;
  ruta: string;
};

const getPurchaseOrderStorageKey = (id: number | string) =>
  `purchase-order-filename:${id}`;

export const parsePurchaseOrderFileName = (pathOrUrl: string) => {
  const normalized = pathOrUrl.trim();
  if (!normalized) {
    return "orden-compra.pdf";
  }

  const lastSegment = normalized.split("/").pop() ?? normalized;
  const baseName = lastSegment.split("?")[0] ?? lastSegment;
  return baseName || "orden-compra.pdf";
};

export const storePurchaseOrderFileName = (
  id: number | string,
  fileName: string,
) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(getPurchaseOrderStorageKey(id), fileName);
};

const getStoredPurchaseOrderFileName = (id: number | string) => {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(getPurchaseOrderStorageKey(id));
};

const getFileNameFromContentDisposition = (header?: string) => {
  if (!header) return undefined;
  try {
    const match = /filename\*?=(?:UTF-8''|\")?([^;\"']+)/i.exec(header);
    if (match && match[1]) {
      return decodeURIComponent(match[1].trim().replace(/^["']|["']$/g, ""));
    }
  } catch {
    // fallthrough
  }
  return undefined;
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

  const contentType = String(response.headers["content-type"] ?? "application/pdf");
  const blob = new Blob([response.data], { type: contentType });
  const filename =
    getFileNameFromContentDisposition(response.headers["content-disposition"]) ||
    getStoredPurchaseOrderFileName(id) ||
    "orden-compra.pdf";
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
): Promise<UploadPurchaseOrderResponse> => {
  const form = new FormData();
  // The API spec names the binary field `orden_compra`
  form.append("orden_compra", file);

  const response = await axiosInstance.post<UploadPurchaseOrderResponse>(
    `/cotizaciones/${id}/orden-compra`,
    form,
  );

  return response.data;
};
