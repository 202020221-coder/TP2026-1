export type SoatBadge = {
  label: string;
  className?: string;
  variant: "outline";
};

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
