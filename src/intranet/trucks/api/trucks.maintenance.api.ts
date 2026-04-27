import axiosInstance from "@/shared/api/axios.config";
import type { TruckMaintenance } from "../interfaces/truck.interface";
import {
  normalizeTruckMaintenance,
  type RawMaintenance,
} from "./trucks.api.shared";

export const trucksMaintenanceApi = {
  async getMantenimientos(placa: string): Promise<TruckMaintenance[]> {
    const encodedPlaca = encodeURIComponent(placa);
    const response = await axiosInstance.get<RawMaintenance[]>(
      `/camiones/${encodedPlaca}/mantenimientos`,
    );
    return response.data.map(normalizeTruckMaintenance);
  },
};
