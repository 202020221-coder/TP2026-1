import sleep from "@/shared/lib/sleep";
import type { Quotation } from "../interfaces/quotation";
import axiosInstance from "@/shared/api/axios.config";
import type {
  GetQuotationResponse,
  GetQuotationsResponse,
} from "../interfaces/responses.dto";
import type { GetQuotationQP } from "../interfaces/query-params.dto";

const normalizeStatus = (value: unknown): "aprobado" | "rechazado" | "pendiente" | "" => {
  const raw = String(value ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[^\x00-\x7F]/g, "");

  if (raw.startsWith("aprob")) return "aprobado";
  if (raw.startsWith("rechaz")) return "rechazado";
  if (raw.startsWith("pend")) return "pendiente";
  return "";
};

const normalizeQuotationsList = (
  raw: any,
  params: GetQuotationQP,
): GetQuotationsResponse => {
  const rawData = Array.isArray(raw?.data)
    ? raw.data
    : Array.isArray(raw?.cotizaciones)
      ? raw.cotizaciones
      : Array.isArray(raw)
        ? raw
        : [];

  const statusFiltered = params.status
    ? rawData.filter(
        (q: any) => normalizeStatus(q?.estado) === normalizeStatus(params.status),
      )
    : rawData;

  const perPage = params.per_page ?? raw?.pagination?.limit ?? 10;
  const page = params.page ?? raw?.pagination?.page ?? 1;

  const total = statusFiltered.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const start = (safePage - 1) * perPage;

  return {
    data: statusFiltered.slice(start, start + perPage),
    pagination: {
      total,
      page: safePage,
      limit: perPage,
      totalPages,
    },
  };
};

export const getAllQuotations = async (
  params: GetQuotationQP,
): Promise<GetQuotationsResponse> => {
  try {
    if (params.dni_o_ruc) {
      try {
        const resp = await axiosInstance.get(`/perfiles/${params.dni_o_ruc}/cotizaciones`);
        return normalizeQuotationsList(resp.data, params);
      } catch (e) {
        try {
          const resp2 = await axiosInstance.get(`/clientes/${params.dni_o_ruc}/cotizaciones`);
          return normalizeQuotationsList(resp2.data, params);
        } catch (e2) {
        }
      }
    }

    const response = await axiosInstance.get<GetQuotationsResponse>("/cotizaciones", { params });
    const normalized = normalizeQuotationsList(response.data, params);
    if (!normalized.data.length && params.dni_o_ruc) {
      const { dni_o_ruc, ...paramsWithoutDni } = params;
      const responseWithoutDni = await axiosInstance.get<GetQuotationsResponse>("/cotizaciones", {
        params: paramsWithoutDni,
      });
      return normalizeQuotationsList(responseWithoutDni.data, params);
    }

    return normalized;
  } catch (err) {
    await sleep(2000);

    const fallback: GetQuotationsResponse = {
      data: [],
      pagination: { total: 0, page: params.page ?? 1, limit: params.per_page ?? 10, totalPages: 0 },
    };
    return fallback;
  }
};

export const getQuotation = async (
  id: Quotation["ID"],
  options?: { dni?: string },
): Promise<GetQuotationResponse | any> => {
  let profileMatch: any = null;

  if (options?.dni) {
    try {
      const resp = await axiosInstance.get(`/perfiles/${options.dni}/cotizaciones`);
      const list = resp.data?.data ?? resp.data;
      if (Array.isArray(list)) {
        const found = list.find((q: any) => Number(q.ID) === Number(id));
        if (found) {
          profileMatch = found;
          return found;
        }
      }
    } catch (e) {
    }

    try {
      const resp2 = await axiosInstance.get(`/clientes/${options.dni}/cotizaciones`);
      const list2 = resp2.data?.data ?? resp2.data;
      if (Array.isArray(list2)) {
        const found2 = list2.find((q: any) => Number(q.ID) === Number(id));
        if (found2) {
          profileMatch = found2;
          return found2;
        }
      }
    } catch (e) {
    }
  }

  try {
    const respDetail = await axiosInstance.get(`/cotizaciones/${id}/detalles`);
    return respDetail.data;
  } catch (err: any) {
    if (profileMatch) {
      return profileMatch;
    }
    try {
      const response = await axiosInstance.get<GetQuotationResponse>(`/cotizaciones/${id}`);
      return response.data;
    } catch (err2: any) {
      if (err2?.response?.status === 404) {
        throw new Error("Cotización no encontrada.");
      }
      if (err?.response?.status === 403 || err2?.response?.status === 403) {
        throw new Error("No autorizado para ver los detalles de esta cotización.");
      }
      throw new Error("Error al obtener la cotización.");
    }
  }
};
