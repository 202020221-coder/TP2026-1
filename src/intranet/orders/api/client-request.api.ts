import { safeRequest } from "@/shared/api/safe-request";
import axiosInstance from "@/shared/api/axios.config";
import type {
  PostClientContactDTO,
  PostClientDTO,
  PostClientPerfilDTO,
  PostRequestDTO,
  PostRequestInventoryDTO,
  PostRequestResponseDTO,
  PostRequestServiceDTO,
} from "../interfaces";

// Empresas (clientes) a las que está asociado un perfil (por su DNI).
// Incluye los datos de la empresa + el cargo/lugar de trabajo del contacto.
export interface PerfilEmpresaContacto {
  DNI_O_RUC?: string;
  nombre_comercial?: string;
  razon_social?: string;
  rubro?: string;
  ubicacion_facturacion?: string;
  observacion?: string | null;
  telefono_contacto?: string | null;
  cargo_en_empresa?: string;
  lugar_trabajo?: string;
}

// Trae las empresas/contactos asociados al perfil del usuario logueado.
// Se usa para autocompletar la solicitud con los datos del cliente.
export const GetPerfilEmpresasContacto = async (
  dniPerfil: string,
): Promise<PerfilEmpresaContacto[]> => {
  const response = await axiosInstance.get<
    PerfilEmpresaContacto[] | { data: PerfilEmpresaContacto[] }
  >(`/perfiles/${encodeURIComponent(dniPerfil)}/empresas_contacto`);

  const payload = response.data;
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.data)) return payload.data;
  return [];
};

//Crea cliente
export const CreateClient = async (data: PostClientDTO) =>
  safeRequest<PostClientDTO>({
    url: "/clientes",
    data: data,
    method: "POST",
  });

//Crea cliente-Perfil
export const CreateClientPerfil = async (data: PostClientPerfilDTO) =>
  safeRequest<PostClientPerfilDTO>({
    url: "/perfiles",
    data: data,
    method: "POST",
  });

//Crea cliente-contacto
export const CreateClientContact = async (id: number, data: PostClientContactDTO) =>
  safeRequest<PostClientContactDTO>({
    url: `/clientes/${id}/contactos`,
    data: data,
    method: "POST",
  });

//Crea solicitud-servicio
export const CreateRequestService = async (
  id: number,
  data: PostRequestServiceDTO
) =>
  safeRequest<PostRequestServiceDTO>({
    url: `/solicitudes/${id}/servicios`,
    data: data,
    method: "POST",
  });

//Crea solicitud-inventario
export const CreateRequestInventory = async (
  id: number,
  data: PostRequestInventoryDTO
) =>
  safeRequest<PostRequestInventoryDTO>({
    url: `/solicitudes/${id}/inventario`,
    data: data,
    method: "POST",
  });

export const CreateRequest = async (data: PostRequestDTO) =>
  safeRequest<PostRequestResponseDTO>({
    url: "/solicitudes",
    data: data,
    method: "POST",
  });
