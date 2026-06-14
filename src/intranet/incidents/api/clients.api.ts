import axiosInstance from "@/shared/api/axios.config";

export interface ClientEntry {
  DNI_O_RUC: string;
  nombre_comercial: string;
  razon_social: string;
}

export const getClients = async (): Promise<ClientEntry[]> => {
  const response = await axiosInstance.get<ClientEntry[] | { data: ClientEntry[] }>("/clientes");
  const payload = response.data;
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.data)) return payload.data;
  return [];
};
