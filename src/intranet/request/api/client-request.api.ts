import { safeRequest } from "@/shared/api/safe-request";
import type {
  PostClientContactDTO,
  PostClientDTO,
  PostClientPerfilDTO,
  PostRequestDTO,
  PostRequestInventoryDTO,
  PostRequestResponseDTO,
  PostRequestServiceDTO,
} from "../interfaces";

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
