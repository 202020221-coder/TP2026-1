import { useCallback, useState, type FC } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/shared/components/ui/table";
import { trucksMaintenanceApi } from "../api/trucks.maintenance.api";
import { useTrucks } from "../hooks/useTrucks";
import type { TruckMaintenance } from "../interfaces/truck.interface";
import { TruckMaintenanceDialog } from "./TruckMaintenanceDialog";
import { TrucksTableControls } from "./TrucksTableControls";
import { TrucksTableHeader } from "./TrucksTableHeader";
import { TrucksTablePlaceholder } from "./TrucksTablePlaceholder";
import { TrucksTableRow } from "./TrucksTableRow";

const PLACEHOLDER_ROWS = 8;

export const TrucksTable: FC = () => {
  const { result, filteredCamiones } = useTrucks();
  const { isPending, isFetching, isError, error } = result;

  const [maintenancePlaca, setMaintenancePlaca] = useState<string | null>(null);
  const [mantenimientos, setMantenimientos] = useState<TruckMaintenance[]>([]);
  const [maintenanceOpen, setMaintenanceOpen] = useState(false);
  const [maintenanceLoading, setMaintenanceLoading] = useState(false);
  const [maintenanceError, setMaintenanceError] = useState<string | null>(null);

  const openMaintenance = useCallback(async (placa: string) => {
    setMaintenancePlaca(placa);
    setMaintenanceOpen(true);
    setMaintenanceError(null);
    setMaintenanceLoading(true);

    try {
      const response = await trucksMaintenanceApi.getMantenimientos(placa);
      setMantenimientos(response);
    } catch {
      setMaintenanceError("No se pudieron cargar los mantenimientos.");
      setMantenimientos([]);
    } finally {
      setMaintenanceLoading(false);
    }
  }, []);

  const onMaintenanceOpenChange = useCallback((open: boolean) => {
    setMaintenanceOpen(open);
    if (!open) {
      setMaintenancePlaca(null);
      setMaintenanceError(null);
      setMantenimientos([]);
    }
  }, []);

  return (
    <>
      <TrucksTableControls>
        <Table containerClassname="flex-1 overflow-auto flex-col">
          <TrucksTableHeader />
          <TableBody>
            {isPending || isFetching ? (
              <TrucksTablePlaceholder rows={PLACEHOLDER_ROWS} />
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={11} className="text-destructive">
                  {error.message}
                </TableCell>
              </TableRow>
            ) : filteredCamiones.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} className="text-center text-muted-foreground">
                  No hay camiones para los filtros seleccionados.
                </TableCell>
              </TableRow>
            ) : (
              filteredCamiones.map((camion) => {
                const fabricanteLabel =
                  camion.Fabricante_Nombre?.trim() || "Sin fabricante";

                return (
                  <TrucksTableRow
                    key={camion.Placa}
                    camion={camion}
                    fabricanteLabel={fabricanteLabel}
                    onOpenMaintenance={openMaintenance}
                  />
                );
              })
            )}
          </TableBody>
        </Table>
      </TrucksTableControls>

      <TruckMaintenanceDialog
        open={maintenanceOpen}
        onOpenChange={onMaintenanceOpenChange}
        placa={maintenancePlaca}
        mantenimientos={mantenimientos}
        isLoading={maintenanceLoading}
        error={maintenanceError}
      />
    </>
  );
};
