import type { Cotizacion } from "@/intranet/presupuestos/interfaces/presupuesto";
import type { Project } from "../interfaces/project";

export function projectToCotizacion(project: Project): Cotizacion | null {
  if (!project.id_cotizacion) {
    return null;
  }

  return {
    ID: project.id_cotizacion,
    nombre: project.Cotizacion_Nombre ?? `Cotización #${project.id_cotizacion}`,
    precioTotal: "0",
    version: 1,
    estado: project.estado,
    nombreCliente: project.Cliente_Nombre ?? "—",
    DNI_O_RUC: "",
    Tasa_Cambio: 0,
    id_solicitud: 0,
  };
}
