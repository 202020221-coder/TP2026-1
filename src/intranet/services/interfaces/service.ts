export interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
  precio_regular: number;
  condicional_precio: string;
  observaciones: string;
  persona_requerida?: string;
}
