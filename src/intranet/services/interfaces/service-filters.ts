export type TipoServicio = "Alquiler" | "Instalación" | "Brigada de Bomberos" | "Otro";

export interface ServicioFilters {
  precioMin: number | "";
  precioMax: number | "";
  tiposServicio: TipoServicio[];
  condicionesPrecio: string[];
}

export const TIPOS_SERVICIO: TipoServicio[] = [
  "Alquiler",
  "Instalación",
  "Brigada de Bomberos",
  "Otro",
];

export const CONDICIONES_PRECIO = [
  "Por m2",
  "Por mes",
  "Por metro",
  "Por punto",
  "Por m3",
  "Por proyecto",
  "Precio fijo",
];

/** Clasifica el nombre de un servicio en su tipo */
export const clasificarTipoServicio = (nombre: string): TipoServicio => {
  const n = nombre.toLowerCase();
  if (n.includes("alquiler")) return "Alquiler";
  if (
    n.includes("instalación") ||
    n.includes("instalacion") ||
    n.includes("diseño") ||
    n.includes("diseno") ||
    n.includes("inspección") ||
    n.includes("inspeccion") ||
    n.includes("supresión") ||
    n.includes("supresion") ||
    n.includes("detección") ||
    n.includes("deteccion") ||
    n.includes("ranurado") ||
    n.includes("bombeo") ||
    n.includes("sistema")
  )
    return "Instalación";
  if (n.includes("brigada") || n.includes("bombero")) return "Brigada de Bomberos";
  return "Otro";
};

export const EMPTY_FILTERS: ServicioFilters = {
  precioMin: "",
  precioMax: "",
  tiposServicio: [],
  condicionesPrecio: [],
};

export const hasActiveFilters = (filters: ServicioFilters): boolean =>
  filters.precioMin !== "" ||
  filters.precioMax !== "" ||
  filters.tiposServicio.length > 0 ||
  filters.condicionesPrecio.length > 0;
