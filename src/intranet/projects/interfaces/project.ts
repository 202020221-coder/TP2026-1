import type { ProjectState } from "../enum/project-state.record";


export interface Project {
  id_Proyecto: number
  descripcion_servicio: string
  ID_Trabajo?: number
  Id_Cliente?: string
  ubicacion: string
  id_cotizacion?: number
  orden_servicio?: string
  informe_final?: string
  factura?: string
  fecha_inicio?: string
  fecha_fin?: string
  observaciones?: string
  estado: ProjectState
  Cliente_Nombre?: string
  Cotizacion_Nombre?: string
  Trabajo_Comentario?: string
}