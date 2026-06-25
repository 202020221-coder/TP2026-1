import type { Pagination } from "@/shared/interfaces/api-response";
import type { Order } from "./order";
import type { OrderState } from "../enum/order-state.record";
import type { PostRequestServiceDTO } from "./create-request.dto";

export interface GetOrderErrorResponse {
  error: string;
}

export type GetOrdersResponse = Pagination<Order[]>;

interface DetailedOrderMedio {
  id: number;
  ID_Solicitud: number;
  cliente_email: string;
  cliente_telefono: string;
}

export interface DetailedOrderService {
  id: number;
  ID_Solicitud: number;
  ID_Servicio: number;
  nombre?: string | null;
  Principal?: boolean;
  id_subservicio?: number | null;
  ubicacion_etapa?: {
    id: number;
    nombre: string;
    orden: number;
  } | null;
  fecha_inicio_servicio: string;
  horario_servicio: string;
  fecha_fin_servicio: string | null;
}

interface DetailedOrderInventoryItem {
  id: number;
  ID_Solicitud: number;
  ID_Inventario: number;
  Id_Objeto?: number;
  cantidad: number;
  intencion: string;
  dias_alquilados: number;
  nombre: string;
  Objeto_Nombre?: string;
  nombre_objeto?: string;
  precio_unitario: string | null;
}

export interface GetOrderResponseDTO {
  ID: number;
  Id_Cliente: string;
  descripcion: string;
  ubicacion: string;
  ProductoEnvio: string;
  CamionesEnvio: string;
  ObsGenerales: string;
  ObsEleccion: string;
  estado: OrderState;
  Respuesta: string;
  FechaCreacion: string;
  Cliente_Nombre: string;
  Razon_Social: string;
  medios: DetailedOrderMedio[];
  servicios: DetailedOrderService[];
  inventario: DetailedOrderInventoryItem[];
  servicio_principal?: PostRequestServiceDTO | null;
  servicios_secundarios?: DetailedOrderService[];
  etapas?: unknown;
}
