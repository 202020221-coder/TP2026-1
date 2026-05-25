import { useState, type FC } from "react";
import {
  Table,
  TableCell,
  TableRow,
  TableBody,
} from "@/shared/components/ui/table";
import { ServiciosTablePlaceholder } from "./ServiciosTablePlaceholder";
import { ServiciosTableControls } from "./ServiciosTableControls";
import { useServicios } from "../hooks/useServicios";
import { ServiciosTableHeader } from "./ServiciosTableHeader";
import { ServicioTableRow } from "./ServiciosTableRow";
import { ServicioFormModal } from "./ServicioFormModal";
import { ServiciosEliminadosModal } from "./ServiciosEliminadosModal";
import { useServicioFilters } from "../hooks/useServicioFilters";

export const ServiciosTable: FC = () => {
  const { result, queryParams } = useServicios();
  const { isPending, isError, error, data } = result;

  const [addOpen, setAddOpen] = useState(false);
  const [eliminadosOpen, setEliminadosOpen] = useState(false);

  // Solo servicios activos como base
  const serviciosActivos = data?.data.filter((s) => s.activo) ?? [];

  // Hook de filtros client-side
  const {
    filters,
    filteredServicios,
    updateFilter,
    resetFilters,
    activeCount,
    open: filterOpen,
    setOpen: setFilterOpen,
  } = useServicioFilters(serviciosActivos);

  return (
    <>
      <ServiciosTableControls
        onAddClick={() => setAddOpen(true)}
        onEliminadosClick={() => setEliminadosOpen(true)}
        filters={filters}
        activeFilterCount={activeCount}
        filterOpen={filterOpen}
        onFilterOpenChange={setFilterOpen}
        onUpdateFilter={updateFilter}
        onResetFilters={resetFilters}
      >
        <Table containerClassname="flex-1 overflow-auto flex-col">
          <ServiciosTableHeader />
          <TableBody>
            {isPending ? (
              <ServiciosTablePlaceholder rows={queryParams.limit ?? 10} />
            ) : isError ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-red-500 py-6"
                >
                  {error.message}
                </TableCell>
              </TableRow>
            ) : filteredServicios.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-gray-400 py-10"
                >
                  {activeCount > 0
                    ? "Ningún servicio coincide con los filtros aplicados."
                    : "No se encontraron servicios activos."}
                </TableCell>
              </TableRow>
            ) : (
              filteredServicios.map((servicio) => (
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
