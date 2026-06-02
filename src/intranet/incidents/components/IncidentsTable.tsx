import type { FC } from "react";
import {
  Table,
  TableCell,
  TableRow,
  TableBody,
} from "@/shared/components/ui/table";
import { IncidentsTablePlaceholder } from "./IncidentsTablePlaceholder";
import { IncidentsTableControls } from "./IncidentsTableControls";
import { IncidentsTableHeader } from "./IncidentsTableHeader";
import { IncidentTableRow } from "./IncidentTableRow";
import { useIncidents } from "../hooks/useIncidents";

export const IncidentsTable: FC = () => {
  const { result, queryParams } = useIncidents();
  const { isPending, isFetching, isError, error, data } = result;

  return (
    <IncidentsTableControls>
      <Table containerClassname="flex-1 overflow-auto flex-col">
        <IncidentsTableHeader />
        <TableBody>
          {isPending || isFetching ? (
            <IncidentsTablePlaceholder rows={queryParams.limit ?? 10} />
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
                No se encontraron incidencias.
              </TableCell>
            </TableRow>
          ) : (
            <>
              {data.data.map((incident) => (
                <IncidentTableRow
                  incident={incident}
                  key={incident.id_incidencia}
                />
              ))}
            </>
          )}
        </TableBody>
      </Table>
    </IncidentsTableControls>
  );
};
