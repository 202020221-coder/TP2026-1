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