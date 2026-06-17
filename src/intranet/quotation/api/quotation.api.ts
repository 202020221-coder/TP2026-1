import type { Quotation, QuotationProduct, ServiceItem } from "../interfaces/quotation";
import type { QuotationAdminDetailData } from "../interfaces/quotation-admin-detail.dto";
import axiosInstance from "@/shared/api/axios.config";
import type { GetQuotationsResponse } from "../interfaces/responses.dto";
import type { GetQuotationQP } from "../interfaces/query-params.dto";
import { RolesRecord } from "@/security/session/enum/roles.enum";
import { useSession } from "@/security/session/hooks/stores/useSession.store";
import { toSearchParams } from "@/shared/lib/to-search-params";
import type { Truck } from "@/intranet/quotation/interfaces/create/order-trucks";
import type { Client } from "@/intranet/quotation/interfaces/create/client";
import type { DesiredQuotationData } from "../interfaces/upsert/desiredQuotationInitialData";
import { toQuotationApiBody } from "../lib/adaptQuotationToApi";

type QuotationAdminDetailRaw = QuotationAdminDetailData & {
  ID?: number;
  ID_solicitud?: number;
  id_incidencia?: number | null;
  Id_incidencia?: number | null;
};

const normalizeQuotationAdminDetail = (
  raw: QuotationAdminDetailRaw,
): QuotationAdminDetailData => ({
  ...raw,
  id: raw.id ?? raw.ID ?? 0,
  id_solicitud: raw.id_solicitud ?? raw.ID_solicitud ?? null,
  Id_incidencia:
    raw.Id_incidencia ?? raw.id_incidencia ?? null,
  costoRecojo: raw.costoRecojo ?? {
    costo: 0,
    fechaRecojo: "",
    direccionRecojo: "",
  },
});

const toQuotationsApiParams = (params: GetQuotationQP) => {
  const { per_page, limit, pendiente_aprobacion, ...rest } = params;
  return {
    ...rest,
    limit: per_page ?? limit,
    ...(pendiente_aprobacion != null
      ? { pendiente_aprobacion }
      : {}),
  };
};

export const getAllQuotations = async (
  params: GetQuotationQP,
): Promise<GetQuotationsResponse> => {
  const sessionState = useSession.getState();
  const apiParams = toQuotationsApiParams(params);

  let response;
  if (sessionState.loggedUser?.rol === RolesRecord.client) {
    response = await axiosInstance.get<GetQuotationsResponse>(
      `/perfiles/${sessionState.loggedUser.dni_perfil}/cotizaciones?${toSearchParams(apiParams)}`,
    );
  } else {
    response = await axiosInstance.get<GetQuotationsResponse>(
      `/cotizaciones?${toSearchParams(apiParams)}`,
    );
  }
  return response.data;
};

export type ApproveQuotationResponse = {
  message: string;
  id_proyecto: number;
  trabajos_creados: number;
};

export const approveQuotation = async (
  id: number,
): Promise<ApproveQuotationResponse> => {
  const response = await axiosInstance.put<ApproveQuotationResponse>(
    `/cotizaciones/${id}/aprobar`,
    {},
  );
  return response.data;
};

export const getQuotationForClient = async (
  id: Quotation["ID"],
): Promise<QuotationAdminDetailData> => {
  const response = await axiosInstance.get<QuotationAdminDetailRaw>(
    `/cotizaciones/${id}/detalles-franco`,
  );
  return normalizeQuotationAdminDetail(response.data);
};

export const getQuotationForAdmin = async (
  id: Quotation["ID"],
): Promise<QuotationAdminDetailData> => {
  const response = await axiosInstance.get<QuotationAdminDetailRaw>(
    `/cotizaciones/${id}/detalles-franco`,
  );
  return normalizeQuotationAdminDetail(response.data);
};

type UpsertQuotationDTO = Omit<DesiredQuotationData, "status"|"client">

type CreateQuotationDTO = UpsertQuotationDTO & {
  id_solicitud: number;
  DNI_O_RUC: string;
  Id_incidencia?: number | null;
};

export const createQuotation = async (data: CreateQuotationDTO) => {
  const body = {
    ...toQuotationApiBody(data),
    id_solicitud: data.id_solicitud,
    DNI_O_RUC: data.DNI_O_RUC,
    Id_incidencia: data.Id_incidencia ?? null,
  };
  await axiosInstance.post("/cotizaciones", body);
};

export const updateQuotation = async (id: number, data: UpsertQuotationDTO) => {
  const body = toQuotationApiBody(data);
  console.log("[updateQuotation] PUT body /cotizaciones/" + id, {
    services: body.services.map((s) => ({ id: s.id, startDate: s.startDate })),
    trucks: body.trucks,
  });
  await axiosInstance.put(`/cotizaciones/${id}`, body);
};

export type AdminQuotationDetailsData = {
  ID: number;
  nombre: string;
  estado: string;
  version: number;
  client: Client;
  productos: QuotationProduct[];
  servicios: ServiceItem[];
  camiones: Truck[];
  costoRecojo: {
    costo: number;
    fechaRecojo: string;
    direccionRecojo: string;
  };
  condiciones: {
    fechaEmision: string;
    fechaVigencia: string;
    condiciones: string;
    observaciones: string;
  };
  tasaCambio: {
    tasaCompra: number;
    tasaVenta: number;
  };
};

export type ClientQuotationDetailsData = {
  ID: number;
  nombre: string;
  estado: string;
  productos: QuotationProduct[];
  servicios: ServiceItem[];
  camiones: Truck[];
  costoRecojo: {
    costo: number;
    fechaRecojo: string;
    direccionRecojo: string;
  };
  condiciones: {
    fechaEmision: string;
    fechaVigencia: string;
  };
  tasaCambio: {
    tasaCompra: number;
    tasaVenta: number;
  };
};

// interface QuotationDetailsData extends Omit<
//   AdminQuotationDetailsData,
//   "camiones" | "tasaCambio" | "client" | "productos" | "servicios"
// > {
//   camiones: BadDefinedTruck[];
//   productos: BadDefinedProduct[];
//   servicios?: ServiceItem[];
//   tipoCambio: {
//     tasaCompra: number;
//     tasaVenta: number;
//   };
//   cliente: {
//     documentoIdentidad: string;
//     nombreComercial: string;
//     razonSocial: string;
//   };
// }

// TODO: EL DIA QUE VEA UN BACK BIEN HECHO JURO POR MI MADRE QUE ME CORTARE LA PINGA CARAJO

// interface BadDefinedTruck extends Omit<Truck, "Placa" | "fecha_prox_revision"> {
//   placa: string;
//   fechaProximaRevision: string;
// }

// interface BadDefinedProduct extends Omit<QuotationProduct, "precio_unitario"> {
//   precioUnitario: string;
// }

// const normalizeTruck = (t: BadDefinedTruck): Truck => ({
//   ...t,
//   Placa: t.placa,
//   fecha_prox_revision: t.fechaProximaRevision,
// });


import type { GetAvailableTrucksResponse } from "../interfaces/responses.dto";
import type { GetAvailableTrucksQP } from "../interfaces/query-params.dto";

//camiones
export const getAvailableTrucks = async ({
  page = 1,
  limit = 10,
}: GetAvailableTrucksQP) => {
  const response = await axiosInstance.get<GetAvailableTrucksResponse>(
    `/camiones?${toSearchParams({ page, limit })}`,
  );
  return response.data;
};

//items de inventario
import type { GetInventoryItemsResponse } from "../interfaces/responses.dto";
import type { GetInventoryItemsQP } from "../interfaces/query-params.dto";

export const getInventoryItems = async ({
  limit = 6,
  page = 1,
}: GetInventoryItemsQP) => {
  const response = await axiosInstance.get<GetInventoryItemsResponse>(
    `/inventario?${toSearchParams({ limit, page })}`,
  );
  return response.data;
};