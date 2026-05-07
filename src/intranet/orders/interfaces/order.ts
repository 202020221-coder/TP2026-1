import type { QuotationProduct } from "@/intranet/quotation/interfaces/quotation";
import { type OrderState } from "../enum/order-state.record";

export interface Order {
  ID: number;
  Cliente_Nombre?: string; //Only visible if the user is an Administrator
  descripcion: string;
  ubicacion: string;
  Respuesta?: string;
  estado: OrderState;
  fecha_inicio: string;
}

export interface DetailedOrder {
  ID: number;
  Id_Cliente: string;
  descripcion: string;
  ubicacion: string;
  ProductoEnvio: any;
  CamionesEnvio: any;
  ObsGenerales: any;
  ObsEleccion: any;
  estado: string;
  Respuesta: any;
  FechaCreacion: any;
  Cliente_Nombre: string;
  medios: Medio[];
  servicios: Servicio[];
  inventario: QuotationProduct[];
  Razon_Social: string;
}

export interface Medio {
  id: number;
  ID_Solicitud: number;
  cliente_email: string;
  cliente_telefono: string;
}

export interface Servicio {
  id: number;
  ID_Solicitud: number;
  ID_Servicio: number;
  fecha_inicio_servicio: string;
  horario_servicio: string;
  fecha_fin_servicio: any;
}

export interface Inventario {
  id: number;
  ID_Solicitud: number;
  ID_Inventario: number;
  cantidad: number;
  intencion: string;
  dias_alquilados: any;
  Objeto_Nombre: string;
}
