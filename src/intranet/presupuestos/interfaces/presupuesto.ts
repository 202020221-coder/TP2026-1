export interface Cotizacion {
  ID: number;
  nombre: string;
  precioTotal: string;
  version: number;
  estado: string;
  nombreCliente: string;
  DNI_O_RUC: string;
  Tasa_Cambio: number;
  id_solicitud: number;
}

export interface CotizacionListResponse {
  data: Cotizacion[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export type TipoPresupuesto =
  | "Material Directo"
  | "Mano de Obra"
  | "Servicios"
  | "Gastos Administrativos"
  | "Costos Indirectos";

export type RealizacionGastos = "en preparacion" | "durante servicio" | "anulada";
export type Moneda = "soles" | "dolares";
export type Estancia = "para proyecto" | "para inventario";

export interface PresupuestoItem {
  ID: number;
  ID_Cotizacion: number;
  tipo: TipoPresupuesto;
  realizacion_gastos: RealizacionGastos;
  nombre_gasto: string;
  costo_unitario?: string;
  cantidad?: string;
  costo_total: string;
  moneda: Moneda;
  estancia?: Estancia;
  costo_x_hora?: string;
  hora_total?: string;
  dias_trabajados?: number;
}

export interface AddPresupuestoItemPayload {
  tipo: TipoPresupuesto;
  nombre_gasto: string;
  costo_total: string;
  realizacion_gastos: RealizacionGastos;
  moneda: Moneda;
  costo_unitario?: string;
  cantidad?: string;
  estancia?: Estancia;
  costo_x_hora?: string;
  hora_total?: string;
  dias_trabajados?: number;
}
