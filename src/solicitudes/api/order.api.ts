import sleep from "@/shared/lib/sleep";
import type {
  GetOrderResponse,
  GetOrdersResponse,
} from "../interfaces/responses.dto";
import type { Order } from "../interfaces/order";
import axiosInstance from "@/shared/api/axios.config";

// import { safeRequest } from "@/shared/api/safe-request";
// import { url } from "zod";
// import { toSearchParams } from "@/shared/lib/to-search-params";

// const FAIL = false;

export const getAllOrders = async (): Promise<GetOrdersResponse> => {
  await sleep(2000);
  const answer = [
    {
      ID: 1,
      Id_Cliente: "20501234567",
      descripcion:
        "Solicitud de instalación de sistema de rociadores y detección para nueva zona de expansión del mall, área aproximada 800 m2",
      ubicacion: "Av. Javier Prado Este 4200, San Borja, Lima",
      estado: "Aprobada",
      fecha_inicio: "2026-04-10T18:05:09.905Z",
      Id_Company: "com-123",
    },
    {
      ID: 2,
      Id_Cliente: "20534567890",
      descripcion:
        "Mantenimiento anual de extintores en todas las áreas de la clínica (35 unidades) e inspección general del sistema de alarma",
      ubicacion: "Jr. Washington 1471, Lima Centro",
      estado: "Pendiente",
      fecha_inicio: "2026-04-10T18:05:09.905Z",
      Id_Company: "com-123",
    },
    {
      ID: 3,
      Id_Cliente: "20523456789",
      descripcion:
        "Diseño e instalación de sistema de supresión con agente limpio para sala de servidores en oficinas Lima, volumen aprox 45 m3",
      ubicacion: "Av. El Derby 254, Surco, Lima",
      estado: "Pendiente",
      fecha_inicio: "2026-04-10T18:05:09.905Z",
      Id_Company: "com-123",
    },
    {
      ID: 4,
      Id_Cliente: "20545678901",
      descripcion:
        "Inspección y certificación de sistemas contra incendios en 3 tiendas de Lima para renovación de licencia municipal",
      ubicacion: "Sedes: Miraflores, San Borja y La Molina",
      estado: "Rechazada",
      fecha_inicio: "2026-04-10T18:05:09.905Z",
      Id_Company: "com-123",
    },
    {
      ID: 5,
      Id_Cliente: "20512345678",
      descripcion:
        "Elaboración de planos contra incendios para expediente INDECI del nuevo piso de habitaciones (pisos 8 al 12)",
      ubicacion: "Av. La Paz 463, Miraflores, Lima",
      estado: "Pendiente",
      fecha_inicio: "2026-04-10T18:05:09.905Z",
      Id_Company: "com-123",
    },
  ] satisfies GetOrdersResponse;
  return answer;
};

// interface GetAllOrdersClientQueryParams {}
// const getAllOrdersClient = (params: GetAllOrdersClientQueryParams) =>
//   safeRequest<Order[]>({
//     url: `/solicitudes/client?${toSearchParams(params)}`,
//   });

export const getOrder = async (id: Order["ID"]): Promise<GetOrderResponse> => {
  const response = await axiosInstance.get<GetOrderResponse>(
    `/solicitudes/${id}`,
  );
  return response.data;
};
