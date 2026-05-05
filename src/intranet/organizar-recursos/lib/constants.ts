export const ORGANIZAR_RECURSOS_DEFAULTS = {
  PAGE_SIZE: 10,
  METODOS_TRASLADO: [
    { value: "camión", label: "Camión" },
    { value: "automóvil", label: "Automóvil" },
    { value: "moto", label: "Moto" },
    { value: "a_pie", label: "A pie" },
  ],
  ESTADOS_OBJETO: [
    { value: "aceptable", label: "Aceptable" },
    { value: "robado", label: "Robado" },
    { value: "averiado", label: "Averiado" },
    { value: "desconocido", label: "Desconocido" },
  ],
  ESTADOS_PROYECTO: [
    { value: "Pendiente", label: "Pendiente" },
    { value: "En Ejecución", label: "En Ejecución" },
    { value: "Completado", label: "Completado" },
  ],
};

export const ESTADO_BADGES: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  Completado: "default",
  "En Ejecución": "secondary",
  Pendiente: "outline",
};
