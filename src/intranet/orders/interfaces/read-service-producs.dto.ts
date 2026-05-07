export interface GetServiceDTO {
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
  mant_ultimo: string;
  mant_fecha_caducidad: string;
  mant_responsable: string;
  mant_contacto: string;
  Fabricante_Nombre: string;
}

export interface GetProductDTO {
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
  mant_ultimo: string;
  mant_fecha_caducidad: string;
  mant_responsable: string;
  mant_contacto: string;
  Fabricante_Nombre: string;
}
