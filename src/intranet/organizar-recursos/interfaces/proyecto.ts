export interface Proyecto {
  id_Proyecto: number;
  descripcion_servicio: string;
  ID_Trabajo: number | null;
  Id_Cliente: string | null;
  ubicacion: string;
  id_cotizacion: number | null;
  orden_servicio: string | null;
  informe_final: string | null;
  factura: string | null;
  fecha_inicio: string;
  fecha_fin: string;
  observaciones: string | null;
  estado: string;
  Cliente_Nombre: string | null;
  Cotizacion_Nombre: string | null;
  Trabajo_Comentario: string | null;
}

export interface ProyectoListResponse {
  data: Proyecto[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ProyectoTodoResponse {
  proyecto: Proyecto;
  camiones: Camion[];
  Subtotal_camiones: number;
  inventario: InventarioAsignado[];
  servicio_envio: unknown | null;
}

export interface Camion {
  id: number;
  id_Proyecto: number;
  Placa: string;
  personal_manejando: number;
  fecha_hora_entrada: string;
  fecha_hora_salida: string | null;
  Camion_Nombre: string;
  precio: number;
}

export interface CamionRequest {
  Placa: string;
  fecha_salida: string;
  fecha_entrada: string;
  id_conductor: number;
}

export interface InventarioAsignado {
  nombre_del_producto: string;
  id_fabricante: number;
  estado: string;
  cantidad: number;
  precio: string;
  subtotal: string;
}

export interface InventarioItem {
  Id_Objeto: number;
  lugar_almacenaje: string;
  cantidad: number;
  nombre_objeto: string;
  ID_Fabricante: number;
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
  mant_requerimiento: string;
  mant_ultimo: string | null;
  mant_fecha_caducidad: string;
  mant_responsable: string | null;
  mant_contacto: string | null;
  Fabricante_Nombre: string;
}

export interface InventarioListResponse {
  data: InventarioItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface InventarioRequestPayload {
  id_objeto: number;
  cantidad_objeto: number;
  estado_post: string;
  fecha_salida: string;
  fecha_retorno: string;
  metodo_traslado: string;
}

export interface Conductor {
  idusuario: number;
  nombre: string;
  dni: string;
  correo: string;
  telefono: string;
  licencia_numero: string;
  licencia_vigencia: string;
  estado: string;
}

export interface ConductoresDisponiblesResponse {
  data: Conductor[];
}

export interface InventarioDelProyectoItem {
  id: number;
  id_Proyecto: number;
  Id_Objeto: number;
  cantidad_objeto: number;
  estado_post: string;
  fecha_salida: string;
  fecha_retorno: string | null;
  metodo_traslado: string;
  Objeto_Nombre: string;
}

