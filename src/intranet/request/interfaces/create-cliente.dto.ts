//Crea Cliente
export interface PostClientDTO {
  DNI_O_RUC: string;
  nombre_comercial: string;
  razon_social: string;
  rubro: string;
  ubicacion_facturacion: string;
  observacion?: string | null;
}

//Crea Cliente-Contacto
export interface PostClientContactDTO {
  id: number;
  DNI_O_RUC: string;
  DNI_perfil: string;
  cargo_en_empresa: string;
  lugar_trabajo: string;
  Contacto_Nombre: string;
  Contacto_Apellido: string;
}

//Solicitud-Servicio
export interface PostRequestServiceDTO {
  id: number;
  ID_Solicitud: number;
  ID_Servicio: number;
  fecha_inicio_servicio: string;
  horario_servicio: string;
  fecha_fin_servicio: string | null;
}

//Solicitud-Inventario
export interface PostRequestInventoryDTO {
  ID_Inventario: number;
  cantidad: number;
  intencion: string;
  dias_alquilados: number;
}
