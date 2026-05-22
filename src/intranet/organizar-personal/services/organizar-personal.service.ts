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

  getById: (id: number) =>
    axios.get<Proyecto>(`/proyectos/${id}`).then((r) => r.data),
};

interface ServicioCotizacionRaw {
  ID_Servicio?: number;
  id?: number;
}

interface PersonalRaw {
  cantidad?: number;
}

export const personalRequeridoService = {
  /**
   * Total personnel required for the project = sum of `cantidad` across
   * every `personal_requerido` row of every service in the quotation.
   */
  getTotalByCotizacion: async (idCotizacion: number): Promise<number> => {
    try {
      const servicesResp = await axios.get<unknown>(
        `/cotizaciones/${idCotizacion}/services`,
      );
      const rawServices = servicesResp.data;
      const services: ServicioCotizacionRaw[] = Array.isArray(rawServices)
        ? (rawServices as ServicioCotizacionRaw[])
        : ((rawServices as { data?: ServicioCotizacionRaw[] })?.data ?? []);

      const ids = services
        .map((s) => s.ID_Servicio ?? s.id)
        .filter((x): x is number => typeof x === "number");

      if (ids.length === 0) return 0;

      const results = await Promise.all(
        ids.map((id) =>
          axios
            .get<unknown>(`/servicios/${id}/personal`)
            .then((r) => {
              const raw = r.data;
              const arr: PersonalRaw[] = Array.isArray(raw)
                ? (raw as PersonalRaw[])
                : ((raw as { data?: PersonalRaw[] })?.data ?? []);
              return arr.reduce(
                (acc, p) => acc + (Number(p?.cantidad) || 0),
                0,
              );
            })
            .catch(() => 0),
        ),
      );

      return results.reduce((a, b) => a + b, 0);
    } catch {
      return 0;
    }
  },
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
