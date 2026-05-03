import sleep from "@/shared/lib/sleep";
import type { Quotation, QuotationProduct } from "../interfaces/quotation";
import axiosInstance from "@/shared/api/axios.config";
import type {
  GetQuotationResponse,
  GetQuotationsResponse,
} from "../interfaces/responses.dto";
import type { GetQuotationQP } from "../interfaces/query-params.dto";

export const getAllQuotations =
  async ({}: GetQuotationQP): Promise<GetQuotationsResponse> => {
    await sleep(2000);
    const answer = [
      {
        ID: 1,
        version: 1,
        nombre: "COT-2025-001 - Mall Aventura Plaza - Rociadores y Detección",
        id_solicitud: 1,
        fecha_inicio: "2026-04-10T18:05:09.905Z",
        DNI_O_RUC: "20501234567",
        precio_total: "98500.00",
        estado: "Aprobada",
        comentario_cliente:
          "Aprobado por gerencia. Solicitan inicio en mayo 2025.",
        mensajes: "Enviado",
      },
      {
        ID: 2,
        version: 1,
        nombre:
          "COT-2025-002 - Clínica Internacional - Mantenimiento Extintores",
        id_solicitud: 2,
        fecha_inicio: "2026-04-10T18:05:09.905Z",
        DNI_O_RUC: "20534567890",
        precio_total: "4250.00",
        estado: "Aprobada",
        comentario_cliente:
          "Aceptado. Prefieren servicio un sábado por la mañana.",
        mensajes: "Pendiente",
      },
      {
        ID: 3,
        version: 1,
        nombre: "COT-2025-003 - Antamina - Supresión Agente Limpio",
        id_solicitud: 3,
        fecha_inicio: "2026-04-10T18:05:09.905Z",
        DNI_O_RUC: "20523456789",
        precio_total: "18500.00",
        estado: "Aprobada",
        comentario_cliente: "Aprobado con cargo a presupuesto SSOMA Q2 2025.",
        mensajes: "Enviado",
      },
      {
        ID: 4,
        version: 1,
        nombre: "COT-2025-004 - Wong - Inspección 3 Tiendas",
        id_solicitud: 4,
        fecha_inicio: "2026-04-10T18:05:09.905Z",
        DNI_O_RUC: "20545678901",
        precio_total: "5800.00",
        estado: "Rechazada",
        comentario_cliente:
          "Indican que el precio está por encima de su presupuesto. Solicitan nueva propuesta.",
        mensajes: "No Iniciado",
      },
      {
        ID: 5,
        version: 2,
        nombre: "COT-2025-004v2 - Wong - Inspección 3 Tiendas (Revisada)",
        id_solicitud: 4,
        fecha_inicio: "2026-04-10T18:05:09.905Z",
        DNI_O_RUC: "20545678901",
        precio_total: "4900.00",
        estado: "Rechazada",
        comentario_cliente: "Segunda versión aceptada con descuento negociado.",
        mensajes: "Enviado",
      },
      {
        ID: 6,
        version: 1,
        nombre: "COT-2025-005 - Casa Andina - Diseño de Planos",
        id_solicitud: 5,
        fecha_inicio: "2026-02-10T18:05:09.905Z",
        DNI_O_RUC: "20512345678",
        precio_total: "3200.00",
        estado: "Pendiente",
        comentario_cliente: "OK, requieren entrega en 20 días útiles.",
        mensajes: "No Iniciado",
      },
    ] satisfies GetQuotationsResponse;
    return answer;
  };

export const getQuotation = async (
  id: Quotation["ID"],
): Promise<GetQuotationResponse> => {
  const response = await axiosInstance.get<GetQuotationResponse>(
    `/cotizaciones/${id}`,
  );
  return response.data;
};

export const getQuotationProducts = async (
  _id: string,
): Promise<QuotationProduct[]> => {
  await sleep(4000);
  return productosMock;
};

const productosMock: QuotationProduct[] = [
  {
    id: "1",
    nombre: "Laptop X",
    intencion: "alquilar",
    cantidad: 2,
    precio_unitario: 1500,
  },
  {
    id: "2",
    nombre: "Mouse inalámbrico",
    intencion: "alquilar",
    cantidad: 5,
    precio_unitario: 25,
  },
  {
    id: "3",
    nombre: "Teclado mecánico",
    intencion: "comprar",
    cantidad: 3,
    precio_unitario: 80,
  },
  {
    id: "4",
    nombre: "Monitor 24''",
    intencion: "alquilar",
    cantidad: 4,
    precio_unitario: 200,
  },
  {
    id: "5",
    nombre: "Auriculares",
    intencion: "alquilar",
    cantidad: 6,
    precio_unitario: 60,
  },
];
