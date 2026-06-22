/** Indica si un servicio es exclusivo de incidencias (valor YES del backend). */
export const isServicioDeIncidencia = (value: unknown): boolean => {
  if (value == null) return false;
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;

  const normalized = String(value).trim().toLowerCase();
  return (
    normalized === "yes" ||
    normalized === "si" ||
    normalized === "sí" ||
    normalized === "1" ||
    normalized === "true"
  );
};

const INCIDENCIA_FIELD_KEYS = [
  "servicio_de_incidencia",
  "Servicio_de_incidencia",
  "servicioDeIncidencia",
  "ServicioDeIncidencia",
  "es_servicio_de_incidencia",
  "es_servicio_incidencia",
] as const;

/** Lee el flag de incidencia tolerando distintos nombres del backend. */
export const pickServicioDeIncidenciaFromRaw = (
  raw: Record<string, unknown>,
): boolean =>
  INCIDENCIA_FIELD_KEYS.some((key) => isServicioDeIncidencia(raw[key]));

export const isServicioDisponibleParaSolicitud = (servicio: {
  activo: boolean;
  servicio_de_incidencia: boolean;
}): boolean => servicio.activo && !servicio.servicio_de_incidencia;
