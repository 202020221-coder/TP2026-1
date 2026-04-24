import type { FC } from "react";
import { TableHeader, TableHead, TableRow } from "@/shared/components/ui/table";
export const QuotationTableHeader: FC = () => {
  return (
    <TableHeader className="[&_tr]:border-b border-gray-200">
      <TableRow className="hover:bg-white">
        <TableHead className="text-gray-500 font-medium">Nombre</TableHead>
        <TableHead className="text-gray-500 font-medium">Fecha</TableHead>
        <TableHead className="text-gray-500 font-medium">
          Precio SubTotal
        </TableHead>
        <TableHead className="text-center text-gray-500 font-medium">
          Estado
        </TableHead>
        <TableHead className="text-center text-gray-500 font-medium">
          Acciones
        </TableHead>
                <TableHead className="text-center text-gray-500 font-medium">
          Mensajes
        </TableHead>
      </TableRow>
    </TableHeader>
  );
};
