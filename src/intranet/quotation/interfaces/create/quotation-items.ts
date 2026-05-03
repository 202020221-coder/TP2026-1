export interface QuotationTruck {
  ID: number;
  ID_Cotizacion: number;
  ID_Camion: number;
  Precio: number;
  Observacion: string | null;
}

export interface QuotationTruckDetail extends QuotationTruck {
  truck?: {
    ID: number;
    Chapa: string;
    Modelo: string;
    Año: number;
  };
}

export type CreateQuotationTruckDto = Omit<
  QuotationTruck,
  "ID"
>;

export type UpdateQuotationTruckDto = Partial<CreateQuotationTruckDto>;

export interface QuotationCommercial {
  ID: number;
  version: number;
  nombre: string;
  ID_solicitud: number;
  DNI_O_RUC: string;
  precio_total: string;
  estado: "aprobado" | "rechazado" | "pendiente";
  comentario_cliente: string;
  fecha_emision: string | null;
  fecha_vigencia: string | null;
  observacion: string | null;
  Tasa_Cambio: number;
  condiciones: string;
}

export type CreateQuotationCommercialDto = Omit<
  QuotationCommercial,
  "ID" | "version"
>;

export type UpdateQuotationCommercialDto = Partial<
  Omit<QuotationCommercial, "ID" | "ID_solicitud" | "version">
>;
export interface QuotationInventory {
  ID: number;
  ID_Cotizacion: number;
  ID_Inventario: number;
  cantidad: number;
  intencion: "comprar" | "alquilar";
  dias_alquilados?: number | null;
  precio_comercial: number;
}

export interface QuotationInventoryDetail extends QuotationInventory {
  inventory?: {
    Id_Objeto: number;
    nombre_objeto: string;
    ID_Fabricante: number;
    estado: string;
    precio_comercial: string;
  };
}

export type CreateQuotationInventoryDto = Omit<
  QuotationInventory,
  "ID"
>;

export type UpdateQuotationInventoryDto = Partial<
  Omit<QuotationInventory, "ID" | "ID_Cotizacion">
>;
export interface QuotationService {
  ID: number;
  ID_Cotizacion: number;
  ID_Servicio: number;
  fecha_inicio: string;
  fecha_finalizacion: string;
  jornada: string;
  precio_comercial: number;
  Ubicacion: string;
}

export interface QuotationServiceDetail extends QuotationService {
  service?: {
    ID: number;
    nombre: string;
    descripcion: string;
  };
}

export type CreateQuotationServiceDto = Omit<
  QuotationService,
  "ID"
>;

export type UpdateQuotationServiceDto = Partial<
  Omit<QuotationService, "ID" | "ID_Cotizacion">
>;
export interface QuotationComplete {
  commercial: QuotationCommercial;
  trucks: QuotationTruckDetail[];
  inventory: QuotationInventoryDetail[];
  services: QuotationServiceDetail[];
}
