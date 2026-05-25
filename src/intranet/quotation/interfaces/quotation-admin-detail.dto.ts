export type QuotationAdminDetailData = {
  ID: number;
  nombre: string;
  estado: string;
  version: number;
  client: {
    DNI_O_RUC: string;
    nombre_comercial: string;
    razon_social: string;
  };
  productos: ({
    id: string;
    nombre: string;
    cantidad: number;
    precio_unitario: number;
  } & (
    | { intencion: "comprar"; dias_alquilados: null }
    | { intencion: "alquilar"; dias_alquilados: number }
  ))[];
  servicios: {
    id: string;
    nombre: string;
    cantidad: number;
    precio_unitario: number;
  }[];
  camiones: {
    Placa: string;
    nombre: string;
    ano_fabricacion: number;
    modelo: string;
    color: string;
    caracteristicas: string;
    revision_tecnica: string;
    fecha_prox_revision: string;
    ID_Fabricante: string | null;
    tarjeta_propiedad: string;
    vencimiento_tarjeta: string;
    soat_n_poliza: string;
    soat_empresa: string;
    soat_precio: string;
    soat_dia_pago: string;
  }[];
  costoRecojo: {
    costo: number;
    fechaRecojo: string;
    direccionRecojo: string;
  };
  condiciones: {
    fechaEmision: string;
    fechaVigencia: string;
    condiciones: string;
    observaciones: string;
  };
  tasaCambio: {
    tasaCompra: number;
    tasaVenta: number;
  };
};
