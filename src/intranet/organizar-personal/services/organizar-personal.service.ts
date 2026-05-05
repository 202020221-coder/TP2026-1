import axios from "@/shared/api/axios.config";
import type {
  Proyecto,
  PaginatedResponse,
  Jornada,
  TrabajadorDisponible,
  CreateJornadaBody,
} from "../types";

export const proyectoService = {
  getAll: (page = 1, limit = 50) =>
    axios
      .get<PaginatedResponse<Proyecto>>(`/proyectos`, { params: { page, limit } })
      .then((r) => r.data),
};

export const trabajoService = {
  getJornadas: (idTrabajo: number) =>
    axios.get<Jornada[]>(`/trabajos/${idTrabajo}/jornadas`).then((r) => r.data),

  createJornada: (idTrabajo: number, body: CreateJornadaBody) =>
    axios
      .post<{ message: string; id: number }>(
        `/trabajos/${idTrabajo}/jornadas`,
        body,
      )
      .then((r) => r.data),

  deleteJornada: (idTrabajo: number, idJornada: number) =>
    axios
      .delete<{ message: string }>(
        `/trabajos/${idTrabajo}/jornadas/${idJornada}`,
      )
      .then((r) => r.data),
};

export const perfilService = {
  getAvailable: (fecha: string) =>
    axios
      .get<TrabajadorDisponible[]>(`/perfiles/trabajadores/disponibles`, {
        params: { fecha },
      })
      .then((r) => r.data),
};
