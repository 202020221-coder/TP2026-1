import type { ServicioEtapaPayload } from "@/intranet/services/interfaces/service";
import type { QuotationPlazosPagoPair } from "../lib/quotation-plazos-pago";

export type QuotationAdminDetailData = {
  id: number;
  nombre: string;
  estado: string;
  version: number;
  id_solicitud?: number | null;
  cliente: {
    documentoIdentidad: string;
    nombreComercial: string;
    razonSocial: string;
  };
  plazos_pago: QuotationPlazosPagoPair;
  productos: ({
    id: string;
    nombre: string;
    cantidad: number;
    precioUnitario: number;
    /** Vínculo al servicio del que un alquiler deriva sus fechas (FK). Nombres
     *  tolerados según el backend. */
    servicio_a_alquilar?: number | string | null;
    id_servicio_alquiler?: number | string | null;
    ID_Servicio?: number | string | null;
  } & (
    | { intencion: "comprar"; dias_alquilados: null }
    | { intencion: "alquilar"; dias_alquilados: number; diasAlquilados?: number | null }
  ))[];
  servicios: {
    idServicio: number;
    nombre: string;
    fecha_inicio: string;
    fecha_finalizacion: string;
    jornada?: string | null;
    jornada_comienzo?: string | null;
    jornada_final?: string | null;
    precio_comercial: string;
    ubicacion: string;
    isPrincipal?: boolean;
    faseOrden?: number | null;
    pagoPorDia?: boolean;
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
    uso?: string | null;
    fecha_hora_entrada?: string | null;
    fecha_hora_salida?: string | null;
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
  /** Etapas guardadas de la cotización (mismo esquema que servicios). */
  etapas?: ServicioEtapaPayload[] | null;
  duracion_etapas?: number | null;
  fecha_inicio_proyecto?: string | null;
  Id_incidencia?: number | null;
};
