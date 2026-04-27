import type { FC } from "react";
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

export const ServiciosTable: FC = () => {
  const { result, queryParams } = useServicios();
  const { isPending, isFetching, isError, error, data } = result;

  return (
    <ServiciosTableControls>
      <Table containerClassname="flex-1 overflow-auto flex-col">
        <ServiciosTableHeader />
        <TableBody>
          {isPending || isFetching ? (
            <ServiciosTablePlaceholder rows={queryParams.limit ?? 10} />
          ) : isError ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-red-500 py-6">
                {error.message}
              </TableCell>
            </TableRow>
          ) : data.data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center text-gray-400 py-10"
              >
                No se encontraron servicios.
              </TableCell>
            </TableRow>
          ) : (
            <>
              {data.data.map((servicio) => (
                <ServicioTableRow servicio={servicio} key={servicio.id} />
              ))}
            </>
          )}
        </TableBody>
      </Table>
    </ServiciosTableControls>
  );
};
