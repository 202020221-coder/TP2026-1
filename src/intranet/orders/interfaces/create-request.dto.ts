//Crea Cliente
export interface PostClientDTO {
  DNI_O_RUC: string;
  nombre_comercial: string;
  razon_social: string;
  rubro: string;
  ubicacion_facturacion: string;
  observacion?: string | null;
}

//Crea Perfil
export interface PostClientPerfilDTO {
  DNI: string;
  Nombre: string;
  Apellido: string;
  correo_contacto: string;
  telefono_contacto: string;
  Genero: string | null;
  RUC: string | null;
  fecha_nacimiento: string | null;
  estado_civil: string | null;
  distrito_residencia: string | null;
  seguro_vida_ley: string | null;
  aficiones: string | null;
  experiencia: string | null;
  comentarios: string | null;
  estado: string | null;
  alergias: string | null;
  condicion_medica: string | null;
  profesion: string | null;
  nro_cta_bancaria: string | null;
  cv: string | null;
  foto_perfil: string | null;
}

export interface PostClientContactDTO {
  DNI_perfil: string;
  cargo_en_empresa: string;
  lugar_trabajo: string;
}

//Solicitud-Servicio
export interface PostRequestServiceDTO {
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

//Solicitud
export interface PostRequestDTO {
  Id_Cliente: string;
  descripcion: string;
  ubicacion: string;
  productoenvio: string | null;
  camionesenvio: string | null;
  obsgenerales: string | null;
  obseleccion: string | null;
}
export interface PostRequestResponseDTO {
  ID?: number;
  id?: number;
  message: string;
}
