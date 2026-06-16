/**
 * Enum de profesiones soportado por el backend.
 *
 * Debe mantenerse alineado con:
 *  - `TRABAJO.profesion` (enum de la tabla TRABAJO)
 *  - la validación enum de `SERVICIO_PERSONAL_REQUERIDO.profesion`
 *  - el filtro `GET /api/perfiles/disponibles?profesion=`
 */
export const PROFESIONES = [
  "bombero",
  "ingeniero de sistemas",
  "ingeniero sanitario",
  "SSOMA",
  "Supervisor de planta",
  "ingeniero ambiental",
  "mecanico",
  "tecnico",
  "arquitecto",
  "piloto",
  "otros",
] as const;

export type Profesion = (typeof PROFESIONES)[number];

/** La profesión "piloto" exige brevete y usa el endpoint de conductores. */
export const PROFESION_PILOTO: Profesion = "piloto";
