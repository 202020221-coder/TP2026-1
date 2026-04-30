export interface Truck {
  Placa: string;
  nombre: string;
  ano_fabricacion: number;
  modelo: string;
  color: string;
  caracteristicas: string;
  revision_tecnica: string;
  fecha_prox_revision: string;
  ID_Fabricante: null | string;
  tarjeta_propiedad: string;
  vencimiento_tarjeta: string;
  soat_n_poliza: string;
  soat_empresa: string;
  soat_precio: string;
  soat_dia_pago: string;
}