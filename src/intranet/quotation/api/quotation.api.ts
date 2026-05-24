import sleep from "@/shared/lib/sleep";
import type { Quotation, QuotationProduct } from "../interfaces/quotation";
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
  _id: Quotation["ID"],
): Promise<ClientQuotationDetailsData> => {
  await sleep(4000);
  return CLIENT_QUOTATION;
};

export const createQuotation = async (data: CreateQuotationBody) => {
  await axiosInstance.post("/cotizaciones", data);
};

export const getQuotationForAdmin = async (
  _id: Quotation["ID"],
): Promise<AdminQuotationDetailsData> => {
  await sleep(4000);
  return ADMIN_QUOTATION;
};

const ADMIN_QUOTATION: AdminQuotationDetailsData = {
  ID: 1,
  nombre: `Cotización de prueba #${1}`,
  estado: "pendiente",
  version: 1,
  client: {
    DNI_O_RUC: "20501234567",
    nombre_comercial: "Mall Aventura Plaza",
    razon_social: "Aventura Plaza S.A.",
  },
  productos: [
    {
      id: "1",
      nombre: "Extintor ABC 10kg",
      cantidad: 5,
      precio_unitario: 120,
      intencion: "comprar",
      dias_alquilados: null,
    },
    {
      id: "2",
      nombre: "Manguera contra incendios 30m",
      cantidad: 2,
      precio_unitario: 250,
      intencion: "alquilar",
      dias_alquilados: 30,
    },
  ],
  camionEspecificado: {
    Placa: "ABC-123",
    nombre: "Camión de prueba",
    ano_fabricacion: 2020,
    modelo: "Model X",
    color: "Blanco",
    caracteristicas: "Capacidad 5 toneladas",
    revision_tecnica: "2026-01-01",
    fecha_prox_revision: "2026-06-01",
    ID_Fabricante: null,
    tarjeta_propiedad: "TP-12345",
    vencimiento_tarjeta: "2026-12-31",
    soat_n_poliza: "SOAT-123",
    soat_empresa: "Seguros ABC",
    soat_precio: "500",
    soat_dia_pago: "15",
  },
  costoRecojo: {
    costo: 100,
    fechaRecojo: "2026-05-25",
    direccionRecojo: "Av. Principal 123, Lima",
  },
  condiciones: {
    fechaEmision: "2026-05-23",
    fechaVigencia: "2026-06-23",
    condiciones:
      "Pago contra entrega. Se aplican términos y condiciones estándar.",
    observaciones: "Cliente solicita factura electrónica.",
  },
  tasaCambio: {
    tasaCompra: 3.75,
    tasaVenta: 3.85,
  },
};

const CLIENT_QUOTATION: ClientQuotationDetailsData = {
  ID: 1,
  nombre: `Cotización de prueba #${1}`,
  estado: "pendiente",
  productos: [
    {
      id: "1",
      nombre: "Extintor ABC 10kg",
      cantidad: 5,
      precio_unitario: 120,
      intencion: "comprar",
      dias_alquilados: null,
    },
    {
      id: "2",
      nombre: "Manguera contra incendios 30m",
      cantidad: 2,
      precio_unitario: 250,
      intencion: "alquilar",
      dias_alquilados: 30,
    },
  ],
  camionEspecificado: {
    Placa: "ABC-123",
    nombre: "Camión de prueba",
    ano_fabricacion: 2020,
    modelo: "Model X",
    color: "Blanco",
    caracteristicas: "Capacidad 5 toneladas",
    revision_tecnica: "2026-01-01",
    fecha_prox_revision: "2026-06-01",
    ID_Fabricante: null,
    tarjeta_propiedad: "TP-12345",
    vencimiento_tarjeta: "2026-12-31",
    soat_n_poliza: "SOAT-123",
    soat_empresa: "Seguros ABC",
    soat_precio: "500",
    soat_dia_pago: "15",
  },
  costoRecojo: {
    costo: 100,
    fechaRecojo: "2026-05-25",
    direccionRecojo: "Av. Principal 123, Lima",
  },
  condiciones: {
    fechaEmision: "2026-05-23",
    fechaVigencia: "2026-06-23",
  },
  tasaCambio: {
    tasaCompra: 3.75,
    tasaVenta: 3.85,
  },
};

export type AdminQuotationDetailsData = {
  ID: number;
  nombre: string;
  estado: string;
  version: number;
  client: Client;
  productos: QuotationProduct[];
  camionEspecificado: Truck;
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
  camionEspecificado: Truck;
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
