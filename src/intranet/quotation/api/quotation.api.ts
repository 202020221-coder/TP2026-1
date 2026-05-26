import type { Quotation, QuotationProduct, ServiceItem } from "../interfaces/quotation";
import type { QuotationAdminDetailData } from "../interfaces/quotation-admin-detail.dto";
import axiosInstance from "@/shared/api/axios.config";
import type {
  CreateQuotationBody,
  GetQuotationsResponse,
} from "../interfaces/responses.dto";
import type { GetQuotationQP } from "../interfaces/query-params.dto";
import { RolesRecord } from "@/security/session/enum/roles.enum";
import { useSession } from "@/security/session/hooks/stores/useSession.store";
import { toSearchParams } from "@/shared/lib/to-search-params";
import type { Truck } from "@/intranet/quotation/interfaces/create/order-trucks";
import type { Client } from "@/intranet/quotation/interfaces/create/client";

export const getAllQuotations = async (
  params: GetQuotationQP,
): Promise<GetQuotationsResponse> => {
  //Obtain session state outside components
  const sessionState = useSession.getState();
  let response;
  if (sessionState.loggedUser?.rol === RolesRecord.client) {
    /**query for client's quotation*/
    response = await axiosInstance.get<GetQuotationsResponse>(
      `/perfiles/${sessionState.loggedUser.dni_perfil}/cotizaciones?${toSearchParams(params)}`,
    );
  } else {
    /**query for project asistant*/
    response = await axiosInstance.get<GetQuotationsResponse>(
      `/cotizaciones?${toSearchParams(params)}`,
    );
  }
  return response.data;
};

export const getQuotationForClient = async (
  id: Quotation["ID"],
): Promise<ClientQuotationDetailsData> => {
  const response = await axiosInstance.get<QuotationDetailsData>(
    `/cotizaciones/${id}/detalles-franco`,
  );

  const costoRecojo = response.data.costoRecojo ?? {
    costo: 0,
    fechaRecojo: "",
    direccionRecojo: "",
  };
  return {
    ...response.data,
    camiones: (response.data.camiones ?? []).map(normalizeTruck),
    costoRecojo,
    tasaCambio: response.data.tipoCambio,
    servicios: response.data.servicios ?? [],
    productos: response.data.productos.map(
      ({ precioUnitario, ...rest }) =>
        ({
          ...rest,
          precio_unitario: Number(precioUnitario),
        }) as QuotationProduct,
    ),
  };
};

export const getQuotationForAdmin = async (
  id: Quotation["ID"],
): Promise<QuotationAdminDetailData> => {
  const response = await axiosInstance.get<QuotationDetailsData>(
    `/cotizaciones/${id}/detalles-franco`,
  );

  const costoRecojo = response.data.costoRecojo ?? {
    costo: 0,
    fechaRecojo: "",
    direccionRecojo: "",
  };
  return {
    ...response.data,
    camiones: (response.data.camiones ?? []).map(normalizeTruck),
    costoRecojo,
    tasaCambio: response.data.tipoCambio,
    servicios: response.data.servicios ?? [],
    client: {
      DNI_O_RUC: response.data.cliente.documentoIdentidad,
      nombre_comercial: response.data.cliente.nombreComercial,
      razon_social: response.data.cliente.razonSocial,
    },
    productos: response.data.productos.map(
      ({ precioUnitario, ...rest }) =>
        ({
          ...rest,
          precio_unitario: Number(precioUnitario),
        }) as QuotationProduct,
    ),
  };
};

export const createQuotation = async (data: CreateQuotationBody) => {
  await axiosInstance.post("/cotizaciones", data);
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

interface QuotationDetailsData extends Omit<
  AdminQuotationDetailsData,
  "camiones" | "tasaCambio" | "client" | "productos" | "servicios"
> {
  camiones: BadDefinedTruck[];
  productos: BadDefinedProduct[];
  servicios?: ServiceItem[];
  tipoCambio: {
    tasaCompra: number;
    tasaVenta: number;
  };
  cliente: {
    documentoIdentidad: string;
    nombreComercial: string;
    razonSocial: string;
  };
}

// TODO: EL DIA QUE VEA UN BACK BIEN HECHO JURO POR MI MADRE QUE ME CORTARE LA PINGA CARAJO

interface BadDefinedTruck extends Omit<Truck, "Placa" | "fecha_prox_revision"> {
  placa: string;
  fechaProximaRevision: string;
}

interface BadDefinedProduct extends Omit<QuotationProduct, "precio_unitario"> {
  precioUnitario: string;
}

const normalizeTruck = (t: BadDefinedTruck): Truck => ({
  ...t,
  Placa: t.placa,
  fecha_prox_revision: t.fechaProximaRevision,
});


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