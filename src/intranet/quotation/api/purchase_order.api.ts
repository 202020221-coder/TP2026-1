import axiosInstance from "@/shared/api/axios.config";
import { isAxiosError } from "axios";
import { resolveBackendFileUrl } from "@/intranet/trucks/lib/maintenance-pdf";
import type {
  PurchaseOrderCheckResult,
  PurchaseOrderContext,
} from "../lib/purchase-order-context";

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

export type PurchaseOrderJsonResponse = {
  url: string;
  cotizacionId?: number;
};

export type PurchaseOrderNotFoundResponse = {
  error?: string;
  existe?: boolean;
  archivo_disponible?: boolean;
  mensaje_ui?: string;
  url?: string;
  orden_compra_rechazada?: "YES" | "NO";
  motivo_rechazo_orden_compra?: string | null;
  mensaje_rechazo_orden_compra?: string | null;
};

export type RejectPurchaseOrderResponse = {
  message: string;
  ID: number;
  orden_compra_rechazada: "YES" | "NO";
  motivo_rechazo_orden_compra?: string;
  mensaje_rechazo_orden_compra?: string;
  tieneOrdenCompra?: boolean;
  pendienteAprobacionOrden?: boolean;
};

export type CheckPurchaseOrderOptions = {
  context: PurchaseOrderContext;
  /** Fallback si el 404 no trae `existe` (p. ej. listado con ruta en BD) */
  metadataIndicatesOc?: boolean;
};

const parseOrdenCompra404 = (
  data: PurchaseOrderNotFoundResponse,
  options: CheckPurchaseOrderOptions,
): PurchaseOrderCheckResult => {
  const existeEnBd = data.existe === true;
  const archivoDisponible = data.archivo_disponible === true;
  const rejectionMessage = data.mensaje_rechazo_orden_compra ?? undefined;

  if (options.context === "incident") {
    if (existeEnBd && !archivoDisponible) {
      return {
        exists: false,
        availability: "unavailable_or_corrupt",
        url: data.url ?? null,
        message:
          data.mensaje_ui ??
          "El archivo de orden de compra no está disponible",
        orden_compra_rechazada: data.orden_compra_rechazada,
        mensaje_rechazo_orden_compra: rejectionMessage,
      };
    }

    return {
      exists: false,
      availability: "missing",
      url: null,
      message: data.mensaje_ui ?? "No existe orden de compra",
      orden_compra_rechazada: data.orden_compra_rechazada,
      mensaje_rechazo_orden_compra: rejectionMessage,
    };
  }

  if (existeEnBd && data.archivo_disponible === false) {
    return {
      exists: false,
      availability: "unavailable_or_corrupt",
      url: data.url ?? null,
      message:
        data.mensaje_ui ??
        "El archivo de orden de compra no está disponible o está dañado. Puede rechazarla para que el cliente envíe una nueva.",
      orden_compra_rechazada: data.orden_compra_rechazada,
      mensaje_rechazo_orden_compra: rejectionMessage,
    };
  }

  return {
    exists: false,
    availability: "missing",
    url: null,
    message:
      data.mensaje_ui ??
      "No hay orden de compra registrada para esta cotización comercial.",
    orden_compra_rechazada: data.orden_compra_rechazada,
    mensaje_rechazo_orden_compra: rejectionMessage,
  };
};

export const checkPurchaseOrderExists = async (
  id: number | string,
  options: CheckPurchaseOrderOptions,
): Promise<PurchaseOrderCheckResult> => {
  try {
    const response = await axiosInstance.get<PurchaseOrderJsonResponse>(
      `/cotizaciones/${id}/orden-compra`,
      { params: { format: "json" } },
    );
    const url = response.data?.url?.trim() || null;
    return {
      exists: Boolean(url),
      availability: url ? "available" : "missing",
      url,
      message: "",
    };
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 404) {
      const data = error.response.data as PurchaseOrderNotFoundResponse;
      return parseOrdenCompra404(data, options);
    }
    throw error;
  }
};

export const rejectPurchaseOrder = async (
  id: number | string,
  motivo: string,
): Promise<RejectPurchaseOrderResponse> => {
  const response = await axiosInstance.put<RejectPurchaseOrderResponse>(
    `/cotizaciones/${id}/orden-compra/rechazar`,
    { motivo },
  );
  return response.data;
};

export const resolvePurchaseOrderPublicUrl = (ordenCompra?: string | null) => {
  if (!ordenCompra?.trim()) {
    return "";
  }
  return resolveBackendFileUrl(ordenCompra);
};

export const getPurchaseOrderJsonUrl = async (
  id: number | string,
): Promise<string | null> => {
  try {
    const response = await axiosInstance.get<PurchaseOrderJsonResponse>(
      `/cotizaciones/${id}/orden-compra`,
      { params: { format: "json" } },
    );
    return response.data?.url?.trim() || null;
  } catch {
    return null;
  }
};

/** Carga el PDF con token (para iframe o vista previa autenticada). */
export const fetchPurchaseOrderBlobUrl = async (
  id: number | string,
): Promise<string> => {
  const response = await axiosInstance.get<ArrayBuffer>(
    `/cotizaciones/${id}/orden-compra`,
    {
      responseType: "arraybuffer",
      headers: { Accept: "application/pdf" },
    } as Parameters<typeof axiosInstance.get>[1],
  );

  const contentType = String(
    response.headers["content-type"] ?? "application/pdf",
  );
  const blob = new Blob([response.data], { type: contentType });
  return URL.createObjectURL(blob);
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
