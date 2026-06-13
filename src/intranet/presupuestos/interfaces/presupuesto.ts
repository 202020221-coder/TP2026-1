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
  // Campos de comparación con gasto real
  gasto_real?: string;
  precio_real?: string;
  aumentos?: string;
  razon_gasto_real?: string;
  involucra_incidencia?: string;
  evidencia_url?: string;
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

export interface GastoRealPayload {
  gasto_real?: string;
  precio_real?: string;
  aumentos?: string;
  razon_gasto_real?: string;
  involucra_incidencia?: string;
}

export interface IncidenciaPresupuesto {
  id_incidencia: number;
  comentario: string;
  estado?: string;
}

export interface ServicioDeCotizacion {
  ID_Servicio: number;
  nombre: string;
}

export interface ChecklistItemPresupuesto {
  id_inventario: number;
  nombre_objeto: string;
  estancia: Estancia;
  cantidad_requerida: number;
  cantidad_en_inventario: number;
  precio_compra: number;
  servicios: string[];
  costo: number;
}

// Interfaz para los items del endpoint /real (campos reales del backend)
export interface PresupuestoRealItem {
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
  costo_real?: string;
  precio_real?: string;
  aumentos?: string;
  prueba?: string;
  razon?: string;
  diferencia?: string;
  ID_Incidencia?: number;
}

export interface ProyectoResumen {
  id_Proyecto: number;
  id_cotizacion: number;
  Proyecto_Nombre: string;
}

export interface InventarioPorServicioPresupuestoResponse {
  ID_Cotizacion: number;
  servicios_de_cotizacion: ServicioDeCotizacion[];
  total_objetos: number;
  costo_total_faltante: number;
  data: ChecklistItemPresupuesto[];
}
