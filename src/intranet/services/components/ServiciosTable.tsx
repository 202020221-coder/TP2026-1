import { useState, type FC } from "react";
import { Table, TableCell, TableRow, TableBody } from "@/shared/components/ui/table";
import { ServiciosTablePlaceholder } from "./ServiciosTablePlaceholder";
import { ServiciosTableControls } from "./ServiciosTableControls";
import { useServicios } from "../hooks/useServicios";
import { ServiciosTableHeader } from "./ServiciosTableHeader";
import { ServicioTableRow } from "./ServiciosTableRow";
import { ServicioFormModal } from "./ServicioFormModal";
import { ServiciosEliminadosModal } from "./ServiciosEliminadosModal";

export const ServiciosTable: FC = () => {
  const { result, queryParams } = useServicios();
  const { isPending, isError, error, data } = result;
  const [addOpen, setAddOpen] = useState(false);
  const [eliminadosOpen, setEliminadosOpen] = useState(false);

  // Solo mostrar servicios activos en la tabla principal
  const serviciosActivos = data?.data.filter((s) => s.activo) ?? [];

  return (
    <>
      <ServiciosTableControls
        onAddClick={() => setAddOpen(true)}
        onEliminadosClick={() => setEliminadosOpen(true)}
      >
        <Table containerClassname="flex-1 overflow-auto flex-col">
          <ServiciosTableHeader />
          <TableBody>
            {isPending ? (
              <ServiciosTablePlaceholder rows={queryParams.limit ?? 10} />
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-red-500 py-6">
                  {error.message}
                </TableCell>
              </TableRow>
            ) : serviciosActivos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-gray-400 py-10">
                  No se encontraron servicios activos.
                </TableCell>
              </TableRow>
            ) : (
              serviciosActivos.map((servicio) => (
                <ServicioTableRow servicio={servicio} key={servicio.id} />
              ))
            )}
          </TableBody>
        </Table>
      </ServiciosTableControls>

      {addOpen && (
        <ServicioFormModal mode="create" onClose={() => setAddOpen(false)} />
      )}

      {eliminadosOpen && (
        <ServiciosEliminadosModal onClose={() => setEliminadosOpen(false)} />
      )}
    </>
  );
};
