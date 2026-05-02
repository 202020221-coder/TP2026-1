export const formatCurrency = (
  value?: number | string,
  currency: "PEN" | "USD" = "USD",
  decimals: number = 2,
) => {
  const num = Number(value ?? 0);
  const locale = currency === "PEN" ? "es-PE" : undefined;
  const symbol = currency === "PEN" ? "S/ " : "$";
  try {
    return Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: decimals,
    }).format(num);
  } catch {
    return symbol + num.toFixed(decimals);
  }
};
