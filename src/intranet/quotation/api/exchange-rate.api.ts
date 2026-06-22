import axiosInstance from "@/shared/api/axios.config";

export type ExchangeRate = {
  buyingRate: number | null;
  sellingRate: number | null;
};

export const EMPTY_EXCHANGE_RATE: ExchangeRate = {
  buyingRate: null,
  sellingRate: null,
};

export const isExchangeRateLoaded = (
  rate?: ExchangeRate | null,
): rate is ExchangeRate & { buyingRate: number; sellingRate: number } =>
  rate != null &&
  rate.buyingRate != null &&
  rate.sellingRate != null &&
  Number.isFinite(rate.buyingRate) &&
  Number.isFinite(rate.sellingRate) &&
  rate.buyingRate > 0 &&
  rate.sellingRate > 0;

export const toStoreExchangeRate = (
  rate?: ExchangeRate | null,
): ExchangeRate | undefined =>
  isExchangeRateLoaded(rate) || (rate?.buyingRate != null || rate?.sellingRate != null)
    ? (rate ?? undefined)
    : undefined;

/**
 * Consulta el tipo de cambio publicado por SUNAT.
 * Puede fallar si el proxy o SUNAT no están disponibles.
 */
export const getExchangeRate = async (): Promise<ExchangeRate> => {
  const response = await axiosInstance.get<string>(
    "https://corsproxy.io/?https://www.sunat.gob.pe/a/txt/tipoCambio.txt",
  );
  const text = response.data;
  const parts = text.split("|");
  return {
    buyingRate: parseFloat(parts[1]),
    sellingRate: parseFloat(parts[2]),
  };
};

/** Intenta obtener tasas de SUNAT; si falla, devuelve tasas vacías (null). */
export const fetchExchangeRateOptional =
  async (): Promise<ExchangeRate> => {
    try {
      const rate = await getExchangeRate();
      return isExchangeRateLoaded(rate) ? rate : EMPTY_EXCHANGE_RATE;
    } catch {
      return EMPTY_EXCHANGE_RATE;
    }
  };
