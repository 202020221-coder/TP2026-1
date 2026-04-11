import { type OrderState } from "../enum/order-state.record";

//need to be respected, I'll need to create an adapter JSON server -> JSON based on Interface
export interface Order {
  ID: number;
  Id_Cliente?: string; //Only visible if the user is an Administrator
  Id_Company?: string; //Only visible if the user is a client
  descripcion: string;
  ubicacion: string;
  estado: OrderState;
  fecha_inicio: string;
}