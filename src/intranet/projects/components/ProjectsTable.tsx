import type { FC } from "react";
import {
  Table,
  TableCell,
  TableRow,
  TableBody,
} from "@/shared/components/ui/table";
import { ProjectsTablePlaceholder } from "./ProjectsTablePlaceholder";
import { ProjectsTableControls } from "./ProjectsTableControls";
import { ProjectsTableHeader } from "./ProjectsTableHeader";
import { ProjectTableRow } from "./ProjectTableRow";
import { useProjects } from "../hooks/useProjects";

export const ProjectsTable: FC = () => {
  const { result, queryParams } = useProjects();
  const { isPending, isFetching, isError, error, data } = result;

  return (
    <ProjectsTableControls>
      <Table containerClassname="flex-1 overflow-auto flex-col">
        <ProjectsTableHeader />
        <TableBody>
          {isPending || isFetching ? (
            <ProjectsTablePlaceholder rows={queryParams.limit ?? 10} />
          ) : isError ? (
            <TableRow>
              <TableCell colSpan={10} className="text-center text-red-500 py-6">
                {error.message}
              </TableCell>
            </TableRow>
          ) : data.data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={10}
                className="text-center text-gray-400 py-10"
              >
                No se encontraron proyectos.
              </TableCell>
            </TableRow>
          ) : (
            <>
              {data.data.map((p) => (
                <ProjectTableRow project={p} key={p.id_Proyecto} />
              ))}
            </>
          )}
        </TableBody>
      </Table>
    </ProjectsTableControls>
  );
};
