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
  serviceId?: number;
  name: string;
  description?: string;
  price?: number | string;
  direccionLugar: string;
  observacionesEleccion: string;
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

/** Opción de servicio público para el paso 6 (selección de servicios). */
export interface ServiceOption {
  id: string;
  serviceId: number;
  name: string;
  description: string;
  price: string | number;
  imageUrl?: string;
  Icon: import("lucide-react").LucideIcon;
}
