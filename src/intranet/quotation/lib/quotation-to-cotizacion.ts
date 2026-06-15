import type { Cotizacion } from "@/intranet/presupuestos/interfaces/presupuesto";
import type { Quotation } from "../interfaces/quotation";

export function quotationToCotizacion(quotation: Quotation): Cotizacion {
  return {
    ID: quotation.ID,
    nombre: quotation.nombre,
    precioTotal: quotation.precioTotal,
    version: quotation.version,
    estado: quotation.estado,
    nombreCliente: quotation.nombreCliente ?? "—",
    DNI_O_RUC: "",
    Tasa_Cambio: quotation.tasaCambio.tasaCompra,
    id_solicitud: 0,
  };
}
