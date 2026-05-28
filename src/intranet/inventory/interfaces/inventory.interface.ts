export type InventarioEstado =
  | "disponible"
  | "en mantenimiento"
  | "malogrado"
  | "en trabajo";

export type InventarioMantRequerimiento = "si" | "no";

export interface InventarioItem {
  Id_Objeto: number;
  lugar_almacenaje: string | null;
  cantidad: number;
  nombre_objeto: string;
  ID_Fabricante: number | null;
  orden_compra: string | null;
  fecha_compra: string;
  factura: string | null;
  garantia: string | null;
  numero_serial: string | null;
  ano_fabricacion: number | null;
  peso: number | null;
  estado: InventarioEstado | string;
  precio_compra: number | null;
  precio_envio: number | null;
  responsable_envio: string | null;
  precio_comercial: number | null;
  mant_requerimiento: InventarioMantRequerimiento | string;
  mant_ultimo: string;
  mant_fecha_caducidad: string;
  mant_responsable: string | null;
  mant_contacto: string | null;
  merma_perdida: number;
  Fabricante_Nombre: string | null;
}

export interface InventarioUbicacionCamion {
  placa: string;
  cantidad: number;
  ubicacion: string;
}

export interface InventarioUbicacionProyecto {
  id_proyecto: number;
  proyecto_nombre: string;
  id_proyecto_inventario: number;
  cantidad: number;
  estado_linea: string;
  ubicacion: string;
  placa_camion: string | null;
  fecha_devolucion_efectiva: string | null;
}

export interface InventarioUbicacionesResponse {
  objeto: {
    Id_Objeto: number;
    nombre_objeto: string;
    cantidad: number;
    merma_perdida: number;
  };
  taller: {
    cantidad: number;
  };
  camiones: InventarioUbicacionCamion[];
  proyectos: InventarioUbicacionProyecto[];
}

export interface InventarioMovimiento {
  id: number;
  Id_Objeto: number;
  cantidad: number;
  tipo_movimiento: string;
  origen_tipo: string | null;
  origen_id: string | number | null;
  destino_tipo: string | null;
  destino_id: string | number | null;
  referencia_tabla: string | null;
  referencia_id: number | null;
  razon: string | null;
  fecha: string;
}
