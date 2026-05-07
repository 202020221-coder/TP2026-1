import type { FC } from "react";
import {
  TableHeader,
  TableHead,
  TableRow,
} from "@/shared/components/ui/table";

export const ProjectsTableHeader: FC = () => {
  return (
    <TableHeader className="[&_tr]:border-b border-gray-200">
      <TableRow className="hover:bg-white">
        <TableHead className="text-gray-500 font-medium">Nombre</TableHead>
        <TableHead className="text-gray-500 font-medium">
          Fecha de inicio
        </TableHead>
        <TableHead className="text-gray-500 font-medium">
          Fecha de finalización
        </TableHead>
        <TableHead className="text-gray-500 font-medium">Cliente</TableHead>
        <TableHead className="text-center text-gray-500 font-medium">
          Estado
        </TableHead>
        <TableHead className="text-center text-gray-500 font-medium">
          Trabajadores
        </TableHead>
        <TableHead className="text-center text-gray-500 font-medium">
          Orden de servicio
        </TableHead>
        <TableHead className="text-center text-gray-500 font-medium">
          Informe
        </TableHead>
        <TableHead className="text-center text-gray-500 font-medium">
          Incidencias
        </TableHead>
        <TableHead className="text-center text-gray-500 font-medium">
          Editar
        </TableHead>
        
      </TableRow>
    </TableHeader>
  );
};
