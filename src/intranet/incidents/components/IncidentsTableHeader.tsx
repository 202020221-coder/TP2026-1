import type { FC } from "react";
import {
  TableHeader,
  TableHead,
  TableRow,
} from "@/shared/components/ui/table";

export const IncidentsTableHeader: FC = () => {
  return (
    <TableHeader className="[&_tr]:border-b border-gray-200">
      <TableRow className="hover:bg-white">
        <TableHead className="text-gray-500 font-medium">ID</TableHead>
        <TableHead className="text-gray-500 font-medium">Cliente</TableHead>
        <TableHead className="text-gray-500 font-medium">Cotización</TableHead>
        <TableHead className="text-gray-500 font-medium">
          Empresa Involucrada
        </TableHead>
        <TableHead className="text-gray-500 font-medium">Comentario</TableHead>
        <TableHead className="text-center text-gray-500 font-medium">
          Remuneración
        </TableHead>
        <TableHead className="text-center text-gray-500 font-medium">
          Estado
        </TableHead>
        <TableHead className="text-center text-gray-500 font-medium">
          Objetos
        </TableHead>
        <TableHead className="text-center text-gray-500 font-medium">
          Involucrados
        </TableHead>
        <TableHead className="text-center text-gray-500 font-medium">
          Acciones
        </TableHead>
      </TableRow>
    </TableHeader>
  );
};
