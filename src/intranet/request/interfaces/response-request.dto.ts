export interface ResponseRequestDTO {
  ID: number;
  Id_Cliente: string;
  descripcion: string;
  ubicacion: string;
  Cliente_Nombre: string;
}

export interface GetRequestQP {
  data: ResponseRequestDTO[];
  pagination: {
    total: number,
    page: number,
    limit: number,
    totalPages: number
  }
}