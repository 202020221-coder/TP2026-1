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

export const ServiciosTable: FC = () => {
  const {
    result,
    servicios,
    pageSize,
    totalItems,
    activeFilterCount,
    filters,
    updateFilter,
    resetFilters,
    filterOpen,
    setFilterOpen,
  } = useServicios();
  const { isPending, isError, error } = result;

  const [addOpen, setAddOpen] = useState(false);
  const [eliminadosOpen, setEliminadosOpen] = useState(false);

  return (
    <>
      <ServiciosTableControls
        onAddClick={() => setAddOpen(true)}
        onEliminadosClick={() => setEliminadosOpen(true)}
        filters={filters}
        activeFilterCount={activeFilterCount}
        filterOpen={filterOpen}
        onFilterOpenChange={setFilterOpen}
        onUpdateFilter={updateFilter}
        onResetFilters={resetFilters}
      >
        <Table containerClassname="flex-1 overflow-auto flex-col">
          <ServiciosTableHeader />
          <TableBody>
            {isPending ? (
              <ServiciosTablePlaceholder rows={pageSize} />
            ) : isError ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-red-500 py-6"
                >
                  {error.message}
                </TableCell>
              </TableRow>
            ) : servicios.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-gray-400 py-10"
                >
                  {totalItems === 0 && activeFilterCount > 0
                    ? "Ningún servicio coincide con los filtros aplicados."
                    : "No se encontraron servicios activos."}
                </TableCell>
              </TableRow>
            ) : (
              servicios.map((servicio) => (
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
