export interface ResponseRequestDTO {
  ID: number;
  Id_Cliente: string;
  descripcion: string;
  ubicacion: string;
  Cliente_Nombre: string;
  ProductoEnvio: string | null;
  CamionesEnvio: string | null;
  ObsGenerales: string | null;
  ObsEleccion: string | null;
  estado: string | null;
  Respuesta: string | null;
  FechaCreacion: string | null;
}

