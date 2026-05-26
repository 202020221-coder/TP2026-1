import { type OrderState } from "../enum/order-state.record";
import type { GetOrderResponseDTO } from "./responses.dto";

export interface Order {
  ID: number;
  Id_Cliente: string;
  Cliente_Nombre?: string; //Only visible if the user is an Administrator
  descripcion: string;
  ubicacion: string;
  Respuesta?: string;
  estado: OrderState;
  fecha_inicio: string;
}

//tipo resultante de adaptacion
export type DetailedOrder = GetOrderResponseDTO