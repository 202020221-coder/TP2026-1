import axios from "@/shared/api/axios.config";
import type {
  Proyecto,
  PaginatedResponse,
  Trabajo,
  TrabajoRaw,
  Asistencia,
  PerfilDisponible,
  PerfilDisponibleRaw,
  UpdateTrabajoBody,
} from "../types";

const toNumber = (v: unknown): number => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const toNullableNumber = (v: unknown): number | null => {
  if (v == null || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

const toNullableString = (v: unknown): string | null => {
  if (v == null) return null;
  const s = String(v).trim();
  return s ? s : null;
};

const ASISTENCIAS: Asistencia[] = ["Programada", "Cancelada", "Realizada"];

const normalizeTrabajo = (raw: TrabajoRaw): Trabajo => {
  const asistencia = ASISTENCIAS.find((a) => a === raw.asistencia) ?? null;
  return {
    Id_trabajo: toNumber(raw.Id_trabajo ?? raw.id_trabajo ?? raw.id),
    Id_Proyecto: toNumber(raw.Id_Proyecto ?? raw.id_proyecto),
    dia: String(raw.dia ?? raw.fecha ?? "").slice(0, 10),
    horario_entrada: String(raw.horario_entrada ?? ""),
    horario_salida: String(raw.horario_salida ?? ""),
    DNI_Trabajador: toNullableString(raw.DNI_Trabajador ?? raw.dni_trabajador),
    profesion: String(raw.profesion ?? ""),
    ID_Servicio: toNullableNumber(raw.ID_Servicio ?? raw.id_servicio),
    comentario: toNullableString(raw.comentario),
    asistencia,
    Trabajador_Nombre: toNullableString(
      raw.Trabajador_Nombre ?? raw.trabajador_nombre ?? raw.nombre,
    ),
    Trabajador_Apellido: toNullableString(
      raw.Trabajador_Apellido ?? raw.trabajador_apellido ?? raw.apellido ?? raw.apellidos,
    ),
  };
};

const normalizePerfil = (raw: PerfilDisponibleRaw): PerfilDisponible => {
  const estado = raw.estado;
  return {
    DNI: String(raw.DNI ?? raw.dni ?? ""),
    Nombre: String(raw.Nombre ?? raw.nombre ?? ""),
    Apellido: String(raw.Apellido ?? raw.apellido ?? raw.apellidos ?? ""),
    profesion_clasificacion: String(
      raw.profesion_clasificacion ?? raw.profesion ?? "",
    ),
    rol: toNullableString(raw.rol),
    estado:
      estado === "disponible" || estado === "en trabajo" || estado === "inhabilitado"
        ? estado
        : "disponible",
  };
};

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
  /** Lista todos los slots TRABAJO del proyecto (ordenados por dia/hora/id). */
  getByProyecto: (idProyecto: number) =>
    axios
      .get<unknown>(`/trabajos/proyecto/${idProyecto}`)
      .then((r) => {
        const raw = r.data;
        const arr: TrabajoRaw[] = Array.isArray(raw)
          ? (raw as TrabajoRaw[])
          : ((raw as { data?: TrabajoRaw[] })?.data ?? []);
        return arr.map(normalizeTrabajo);
      }),

  /** Asigna/actualiza un slot: DNI_Trabajador, asistencia, comentario. */
  update: (idTrabajo: number, body: UpdateTrabajoBody) =>
    axios
      .put<{ message?: string }>(`/trabajos/${idTrabajo}`, body)
      .then((r) => r.data),
};

export const perfilService = {
  /**
   * Trabajadores disponibles para una fecha y profesión (enum). Para "piloto"
   * el backend exige brevete. Solo devuelve estados "disponible"/"en trabajo".
   */
  getDisponibles: (fecha: string, profesion: string) =>
    axios
      .get<unknown>(`/perfiles/disponibles`, { params: { fecha, profesion } })
      .then((r) => {
        const raw = r.data;
        const arr: PerfilDisponibleRaw[] = Array.isArray(raw)
          ? (raw as PerfilDisponibleRaw[])
          : ((raw as { data?: PerfilDisponibleRaw[] })?.data ?? []);
        return arr.map(normalizePerfil);
      }),
};
