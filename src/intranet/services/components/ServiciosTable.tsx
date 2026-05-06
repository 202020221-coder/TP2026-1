import { useState, type FC } from "react";
import { Table, TableCell, TableRow, TableBody } from "@/shared/components/ui/table";
import { ServiciosTablePlaceholder } from "./ServiciosTablePlaceholder";
import { ServiciosTableControls } from "./ServiciosTableControls";
import { useServicios } from "../hooks/useServicios";
import { ServiciosTableHeader } from "./ServiciosTableHeader";
import { ServicioTableRow } from "./ServiciosTableRow";
import { ServicioFormModal } from "./ServicioFormModal";

export const ServiciosTable: FC = () => {
  const { result, queryParams } = useServicios();
  // isPending = primera carga sin datos; isFetching = refetch en background (ya hay datos)
  const { isPending, isError, error, data } = result;
  const [addOpen, setAddOpen] = useState(false);

  return (
    <>
      <ServiciosTableControls onAddClick={() => setAddOpen(true)}>
        <Table containerClassname="flex-1 overflow-auto flex-col">
          <ServiciosTableHeader />
          <TableBody>
            {isPending ? (
              // Solo mostrar skeleton en la primera carga, NO en cada refetch
              <ServiciosTablePlaceholder rows={queryParams.limit ?? 10} />
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-red-500 py-6">
                  {error.message}
                </TableCell>
              </TableRow>
            ) : data && data.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-gray-400 py-10">
                  No se encontraron servicios.
                </TableCell>
              </TableRow>
            ) : (
              data?.data.map((servicio) => (
                <ServicioTableRow servicio={servicio} key={servicio.id} />
              ))
            )}
          </TableBody>
        </Table>
      </ServiciosTableControls>

      {addOpen && (
        <ServicioFormModal mode="create" onClose={() => setAddOpen(false)} />
      )}
    </>
  );
};
