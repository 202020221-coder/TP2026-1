export interface ProjectCamion {
  id: number;
  id_Proyecto: number;
  Placa: string;
  personal_manejando: number;
  fecha_hora_entrada: string;
  fecha_hora_salida: string;
  estado: string;
  razon: string;
  Camion_Nombre: string;
  precio: number;
}

export interface ProjectInventario {
  nombre_del_producto: string;
  id_fabricante: number;
  estado: string;
  cantidad: number;
  precio: string;
  subtotal: string;
}

export interface ProjectDetail {
  proyecto: {
    id_Proyecto: number;
    descripcion_servicio: string;
    ID_Trabajo?: number;
    Id_Cliente?: string;
    ubicacion: string;
    id_cotizacion?: number;
    orden_servicio?: string;
    informe_final?: string;
    factura?: string;
    fecha_inicio?: string;
    fecha_fin?: string;
    observaciones?: string;
    estado: string;
    Cliente_Nombre?: string;
    Cotizacion_Nombre?: string;
    Trabajo_Comentario?: string;
  };
  camiones: ProjectCamion[];
  Subtotal_camiones: number;
  inventario: ProjectInventario[];
  servicio_envio: null | number;
}