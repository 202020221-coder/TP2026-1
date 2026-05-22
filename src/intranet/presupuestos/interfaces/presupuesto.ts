export interface Presupuesto {
  ID: number;
  ID_Cotizacion: number;
  costos_indirectos: string;
  coste_total_estimado: string;
  Cotizacion_Nombre: string;
}

export interface PresupuestoListResponse {
  data: Presupuesto[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface MaterialDirecto {
  id: number;
  ID_Presupuesto: number;
  nombre: string;
  costo: string;
}

export interface ManoObra {
  id: number;
  ID_Presupuesto: number;
  profesion_ejercida: string;
  costo_x_hora: string;
  costo_general: string;
}

export interface ServicioPresupuesto {
  id: number;
  ID_Presupuesto: number;
  nombre_servicio: string;
  costo: string;
}

export interface GastoAdmin {
  id: number;
  ID_Presupuesto: number;
  nombre_gasto: string;
  costo: string;
}
