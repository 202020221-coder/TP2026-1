export const formatPEDate = (ISOSDate: string) =>
  new Date(ISOSDate).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
