import type { FC } from "react";
import {
  TableHeader,
  TableHead,
  TableRow,
} from "@/shared/components/ui/table";

export const ServiciosTableHeader: FC = () => {
  return (
    <TableHeader className="[&_tr]:border-b border-gray-200">
      <TableRow className="hover:bg-white">
        <TableHead className="text-gray-500 font-medium">Nombre</TableHead>
        <TableHead className="text-gray-500 font-medium">Descripción</TableHead>
        <TableHead className="text-gray-500 font-medium">
          Precio Regular
        </TableHead>
        <TableHead className="text-gray-500 font-medium">
          Condicional de Precio
        </TableHead>
        <TableHead className="text-gray-500 font-medium">
          Observaciones
        </TableHead>
        <TableHead className="text-center text-gray-500 font-medium">
          Persona Requerida
        </TableHead>
        <TableHead className="text-center text-gray-500 font-medium">
          Acciones
        </TableHead>
      </TableRow>
    </TableHeader>
  );
};
