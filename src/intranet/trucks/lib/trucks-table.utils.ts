import type { TruckEstado } from "../interfaces/truck.interface";

export type SoatBadge = {
  label: string;
  className?: string;
  variant: "outline";
};

export type TruckEstadoBadge = {
  label: string;
  className?: string;
  variant: "outline";
};

export const normalizeTruckEstado = (
  value?: string | null,
): TruckEstado | null => {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  const normalized = trimmed.toLowerCase();
  switch (normalized) {
    case "operacional":
      return "Operacional";
    case "ocupado":
      return "Ocupado";
    case "en mantenimiento":
      return "En mantenimiento";
    case "inoperativo":
      return "inoperativo";
    case "descalificado":
      return "descalificado";
    default:
      return trimmed as TruckEstado;
  }
};

export const TRUCK_ESTADO_OPTIONS: Array<{ value: TruckEstado; label: string }> = [
  { value: "Operacional", label: "Operacional" },
  { value: "Ocupado", label: "Ocupado" },
  { value: "En mantenimiento", label: "En mantenimiento" },
  { value: "inoperativo", label: "Inoperativo" },
  { value: "descalificado", label: "Descalificado" },
];

export const formatTruckTableDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const getSoatStatus = (soatDate: string): SoatBadge => {
  const date = new Date(soatDate);
  if (Number.isNaN(date.getTime())) {
    return {
      label: "Sin fecha",
      variant: "outline",
      className: "bg-gray-200 text-gray-600 border-gray-400",
    };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  const diffDays = Math.ceil(
    (date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffDays < 0) {
    return {
      label: "Vencido",
      variant: "outline",
      className: "bg-red-200 text-red-600 border-red-400",
    };
  }

  if (diffDays < 30) {
    return {
      label: `Por vencer (${diffDays}d)`,
      variant: "outline",
      className: "border-yellow-300 bg-yellow-100 text-yellow-900",
    };
  }

  return {
    label: "Vigente",
    variant: "outline",
    className: "border-green-300 bg-green-100 text-green-900",
  };
};

export const getTruckEstadoBadge = (
  estado?: TruckEstado | string | null,
): TruckEstadoBadge => {
  const normalized = normalizeTruckEstado(estado ?? null);

  if (!normalized) {
    return {
      label: "Sin estado",
      variant: "outline",
      className: "bg-gray-200 text-gray-600 border-gray-300",
    };
  }

  switch (normalized) {
    case "Operacional":
      return {
        label: "Operacional",
        variant: "outline",
        className: "bg-green-100 text-green-800 border-green-300",
      };
    case "Ocupado":
      return {
        label: "Ocupado",
        variant: "outline",
        className: "bg-blue-100 text-blue-800 border-blue-300",
      };
    case "En mantenimiento":
      return {
        label: "En mantenimiento",
        variant: "outline",
        className: "bg-yellow-100 text-yellow-800 border-yellow-300",
      };
    case "inoperativo":
      return {
        label: "Inoperativo",
        variant: "outline",
        className: "bg-red-100 text-red-800 border-red-300",
      };
    case "descalificado":
      return {
        label: "Descalificado",
        variant: "outline",
        className: "bg-gray-200 text-gray-700 border-gray-300",
      };
    default:
      return {
        label: normalized,
        variant: "outline",
        className: "bg-gray-200 text-gray-600 border-gray-300",
      };
  }
};
