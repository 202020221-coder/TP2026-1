import axiosInstance from "@/shared/api/axios.config";

export const getExchangeRate = async () => {
  const response = await axiosInstance.get<string>(
    "https://corsproxy.io/?https://www.sunat.gob.pe/a/txt/tipoCambio.txt",
  );
  const text = response.data;
  const parts = text.split("|");
  return {
    tasa_compra: parseFloat(parts[1]),
    tasa_venta: parseFloat(parts[2]),
  };
};
