export type QuotationAdminDetailData = {
  id: number;
  nombre: string;
  estado: string;
  version: number;
  cliente: {
    documentoIdentidad: string;
    nombreComercial: string;
    razonSocial: string;
  };
  productos: ({
    id: string;
    nombre: string;
    cantidad: number;
    precioUnitario: number;
  } & (
    | { intencion: "comprar"; dias_alquilados: null }
    | { intencion: "alquilar"; dias_alquilados: number }
  ))[];
  servicios: {
    idServicio: number;
    nombre: string;
    fecha_inicio: string;
    fecha_finalizacion: string;
    jornada:string;
    precio_comercial: string;
    ubicacion: string;
  }[];
  camiones: {
    placa: string;
    nombre: string;
    anoFabricacion: number;
    modelo: string;
    color: string;
    caracteristicas: string;
    revisionTecnica: string;
    fechaProximaRevision: string;
    tarjetaPropiedad: string;
    vencimientoTarjeta: string;
    soatPoliza: string;
    soatEmpresa: string;
    soatPrecio: string;
    soatDiaPago: string;
  }[];
  costoRecojo: {
    costo: number;
    fechaRecojo: string;
    direccionRecojo: string;
  } | null;
  condiciones: {
    fechaEmision: string;
    fechaVigencia: string;
    condiciones: string;
    observaciones: string;
  };
  tipoCambio: {
    tasaCompra: number;
    tasaVenta: number;
  };
  etapas: number | null;
  duracion_etapas: number | null;
};
