import axios from "@/shared/api/axios.config";
import type {
  Proyecto,
  PaginatedResponse,
  Jornada,
  JornadaRaw,
  TrabajadorDisponible,
  CreateJornadaBody,
} from "../types";

const toNumber = (v: unknown): number => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const normalizeJornada = (raw: JornadaRaw): Jornada => ({
  Id_Jornada: toNumber(raw.Id_Jornada ?? raw.id_jornada ?? raw.id),
  Id_Trabajo: toNumber(raw.Id_Trabajo ?? raw.id_trabajo),
  DNI_Trabajador: String(raw.DNI_Trabajador ?? raw.dni_trabajador ?? ""),
  dia: String(raw.dia ?? raw.fecha ?? ""),
  horario_entrada: String(raw.horario_entrada ?? ""),
  horario_salida: String(raw.horario_salida ?? ""),
  Trabajador_Nombre: String(
    raw.Trabajador_Nombre ?? raw.trabajador_nombre ?? raw.nombre ?? "",
  ),
  Trabajador_Apellido: String(
    raw.Trabajador_Apellido ??
      raw.trabajador_apellido ??
      raw.apellidos ??
      raw.apellido ??
      "",
  ),
});

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
    axios
      .get<unknown>(`/trabajos/${idTrabajo}/jornadas`)
      .then((r) => {
        const raw = r.data;
        const arr: JornadaRaw[] = Array.isArray(raw)
          ? (raw as JornadaRaw[])
          : ((raw as { data?: JornadaRaw[] })?.data ?? []);
        return arr.map(normalizeJornada);
      }),

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
