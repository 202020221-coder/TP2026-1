const isValidDisplayDate = (date: Date): boolean =>
  !Number.isNaN(date.getTime()) && date.getFullYear() >= 2000;

/** Formatea la fecha de creación; si el backend no envía una válida, usa hoy. */
export const formatOrderDisplayDate = (raw?: string | null): string => {
  const fallback = new Date();
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  if (!raw?.trim()) {
    return fallback.toLocaleDateString("es-PE", options);
  }

  const parsed = new Date(raw);
  const date = isValidDisplayDate(parsed) ? parsed : fallback;
  return date.toLocaleDateString("es-PE", options);
};
