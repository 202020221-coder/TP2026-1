import type { QuotationProduct } from "@/intranet/quotation/interfaces/quotation";
import { type OrderState } from "../enum/order-state.record";

export interface Order {
  ID: number;
  Id_Cliente:string;
  Cliente_Nombre?: string; //Only visible if the user is an Administrator
  descripcion: string;
  ubicacion: string;
  Respuesta?: string;
  estado: OrderState;
  fecha_inicio: string;
}

export interface Medio {
  id: number;
  ID_Solicitud: number;
  cliente_email: string;
  cliente_telefono: string;
}

export interface Service {
  id: number;
  ID_Solicitud: number;
  ID_Servicio: number;
  fecha_inicio_servicio: string;
  horario_servicio: string;
  fecha_fin_servicio: string;
}

export interface DetailedOrder {
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
  medios: Medio[];
  servicios: Service[];
  inventario: QuotationProduct[];
}
