import type { Pagination } from "@/shared/interfaces/api-response";
import type { Order } from "./order";

export type GetOrderResponse = {
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
  Cliente_Nombre: string;
};
export type GetOrdersResponse = Pagination<Order[]>;
