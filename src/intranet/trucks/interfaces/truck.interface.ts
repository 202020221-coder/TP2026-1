export type TruckEstado =
  | "Operacional"
  | "Ocupado"
  | "En mantenimiento"
  | "inoperativo"
  | "descalificado";

export interface Truck {
  Placa: string;
  nombre: string;
  ano_fabricacion: number;
  modelo: string;
  color: string;
  Estado: TruckEstado;
  caracteristicas: string;
  revision_tecnica: string;
  fecha_prox_revision: string;
  ID_Fabricante: number | null;
  Fabricante_Nombre: string | null;
  tarjeta_propiedad: string;
  vencimiento_tarjeta: string;
  soat_n_poliza: string;
  soat_empresa: string;
  soat_precio: number;
  soat_dia_pago: string;
}

export type RegisterTruckPayload = Omit<Truck, "Fabricante_Nombre" | "ID_Fabricante"> & {
  ID_Fabricante: number;
};

export type UpdateTruckPayload = Pick<
  Truck,
  | "nombre"
  | "modelo"
  | "color"
  | "Estado"
  | "soat_n_poliza"
  | "soat_empresa"
  | "soat_precio"
  | "soat_dia_pago"
>;

export interface TruckMaintenance {
  id?: number;
  fecha_ultimo_mant: string;
  responsable: string;
  razon: string;
  contacto_responsable: string;
  pdf_mantenimiento: string;
}

export interface TruckInventoryItem {
  id?: number;
  Id_Objeto: number;
  cantidad_requerida: number;
  cantidad_actual: number;
  ubicacion_en_camion: string;
  requerido_legal: "si" | "no";
}

export interface TruckInventoryDetail {
  Id_Objeto: number;
  lugar_almacenaje: string;
  cantidad: number;
  nombre_objeto: string;
  ID_Fabricante: number | null;
  Fabricante_Nombre: string | null;
  orden_compra: string;
  fecha_compra: string;
  factura: string | null;
  garantia: string;
  numero_serial: string;
  ano_fabricacion: number;
  peso: string;
  estado: string;
  precio_compra: string;
  precio_envio: string;
  responsable_envio: string;
  precio_comercial: string;
  mant_requerimiento: "si" | "no";
  mant_ultimo: string | null;
  mant_fecha_caducidad: string;
  mant_responsable: string | null;
  mant_contacto: string | null;
}

export interface TruckInventoryRow extends TruckInventoryItem {
  detalle: TruckInventoryDetail | null;
}
