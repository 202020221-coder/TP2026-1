import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import { trucksInventoryApi } from "../api/trucks.inventory.api";
import { trucksMaintenanceApi } from "../api/trucks.maintenance.api";
import type {
  TruckInventoryDetail,
  TruckInventoryRow,
  TruckMaintenance,
} from "../interfaces/truck.interface";

type NewTruckInventoryItem = Omit<TruckInventoryRow, "id" | "detalle">;

const tryGetInventoryDetail = async (
  idObjeto: number,
): Promise<TruckInventoryDetail | null> => {
  try {
    return await trucksInventoryApi.getInventarioPorId(idObjeto);
  } catch {
    return null;
  }
};

export const useTruckInventory = () => {
  const { placa } = useParams();

  const [inventario, setInventario] = useState<TruckInventoryRow[]>([]);
  const [mantenimientos, setMantenimientos] = useState<TruckMaintenance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const verifyInventoryAddApplied = useCallback(
    async (truckPlate: string, itemToAssign: NewTruckInventoryItem) => {
      try {
        const currentInventoryResponse = await trucksInventoryApi.getInventarioByCamion(truckPlate);
        return currentInventoryResponse.some(
          (item) =>
            item.Id_Objeto === itemToAssign.Id_Objeto &&
            item.ubicacion_en_camion === itemToAssign.ubicacion_en_camion,
        );
      } catch {
        return false;
      }
    },
    [],
  );

  const verifyInventoryDeleteApplied = useCallback(
    async (truckPlate: string, assignmentId: number) => {
      try {
        const currentInventoryResponse = await trucksInventoryApi.getInventarioByCamion(truckPlate);
        return !currentInventoryResponse.some((item) => item.id === assignmentId);
      } catch {
        return false;
      }
    },
    [],
  );

  const loadData = useCallback(async (truckPlate?: string) => {
    const currentPlaca = truckPlate ?? placa;

    if (!currentPlaca) {
      setInventario([]);
      setMantenimientos([]);
      setError("No se encontró la placa del camión.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const [inventarioResponse, mantenimientosResponse] = await Promise.all([
        trucksInventoryApi.getInventarioByCamion(currentPlaca),
        trucksMaintenanceApi.getMantenimientos(currentPlaca),
      ]);

      const details = await Promise.all(
        inventarioResponse.map(async (item) => ({
          ...item,
          detalle: item.detalle ?? (await tryGetInventoryDetail(item.Id_Objeto)),
        })),
      );

      setInventario(details);
      setMantenimientos(mantenimientosResponse);
    } catch {
      setError("No se pudieron cargar los datos del camión.");
      setInventario([]);
      setMantenimientos([]);
    } finally {
      setIsLoading(false);
    }
  }, [placa]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const asignarInventario = useCallback(
    async (data: NewTruckInventoryItem) => {
      if (!placa) {
        setError("No se encontró la placa del camión.");
        return false;
      }

      setIsLoading(true);
      setError(null);

      try {
        await trucksInventoryApi.asignarItem(placa, {
          Id_Objeto: data.Id_Objeto,
          cantidad_requerida: data.cantidad_requerida,
          cantidad_actual: data.cantidad_actual,
          ubicacion_en_camion: data.ubicacion_en_camion,
          requerido_legal: data.requerido_legal,
        });

        await loadData(placa);
        setError(null);
        return true;
      } catch {
        try {
          const applied = await verifyInventoryAddApplied(placa, data);
          if (!applied) {
            setError("No se pudo asignar el ítem al camión.");
            return false;
          }

          await loadData(placa);
          setError(null);
          return true;
        } catch {
          setError("No se pudo asignar el ítem al camión.");
          return false;
        }
      } finally {
        setIsLoading(false);
      }
    },
    [loadData, placa, verifyInventoryAddApplied],
  );

  const desasignarInventario = useCallback(
    async (iid: number) => {
      if (!placa) {
        setError("No se encontró la placa del camión.");
        return false;
      }

      setIsLoading(true);
      setError(null);

      try {
        await trucksInventoryApi.desasignarItem(placa, iid);

        await loadData(placa);
        setError(null);
        return true;
      } catch {
        try {
          const applied = await verifyInventoryDeleteApplied(placa, iid);
          if (!applied) {
            setError("No se pudo eliminar el ítem del camión.");
            return false;
          }

          await loadData(placa);
          setError(null);
          return true;
        } catch {
          setError("No se pudo eliminar el ítem del camión.");
          return false;
        }
      } finally {
        setIsLoading(false);
      }
    },
    [loadData, placa, verifyInventoryDeleteApplied],
  );

  return {
    placa,
    inventario,
    mantenimientos,
    isLoading,
    error,
    reload: loadData,
    asignarInventario,
    desasignarInventario,
  };
};
