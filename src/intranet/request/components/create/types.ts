import type {
  PostClientContactDTO,
  PostClientDTO,
  PostClientPerfilDTO,
  PostRequestDTO,
} from "../../interfaces";

export type ClientType = "jurídica" | "física";

export type ClientFormData = Omit<PostClientDTO, "observacion"> & {
  observacion: string;
};

export type PerfilFormData = Pick<
  PostClientPerfilDTO,
  "DNI" | "Nombre" | "Apellido" | "correo_contacto" | "telefono_contacto"
> & {
  Genero: string;
};

export type ContactFormData = PostClientContactDTO;

export interface ServiceFormData {
  Id_Cliente: PostRequestDTO["Id_Cliente"];
  descripcion: PostRequestDTO["descripcion"];
  ubicacion: PostRequestDTO["ubicacion"];
  productoenvio: string;
  camionesenvio: string;
  obsgenerales: string;
  obseleccion: string;
  estado: string;
  Respuesta: string;
}

export interface SelectedProduct {
  id: string;
  productId: string;
  name: string;
  category?: string;
  intent: "alquilar" | "comprar";
  days?: number;
  quantity: number;
}

export interface SelectedTruck {
  id: string;
  truckId?: string;
  name: string;
  description?: string;
  intent: "alquilar" | "comprar";
  quantity: number;
  days?: number;
  price?: number | string;
}

export interface PreferencesData {
  generalObservations: string;
  selectionObservations: string;
}

export interface ClientOption {
  id: ClientType;
  label: string;
  description: string;
  icon: string;
}

export interface CatalogOption {
  id: string;
  category: string;
  name: string;
  garantia: string;
  precio_comercial: string | number;
}

export interface TruckOption {
  id: string;
  name: string;
  description: string;
  price: string | number;
}
