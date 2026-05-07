import axiosInstance from "@/shared/api/axios.config";

/**
 * TODO:
 * Find a way to obtain the exchange rate in production
 * 
 */
export const getExchangeRate = async ():Promise<ExchangeRate> => {
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
export type ExchangeRate = { sellingRate: number; buyingRate: number };
