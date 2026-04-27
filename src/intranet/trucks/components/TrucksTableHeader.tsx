import type { FC } from "react";
import { TableHeader, TableHead, TableRow } from "@/shared/components/ui/table";

export const TrucksTableHeader: FC = () => {
  return (
    <TableHeader className="[&_tr]:border-b border-gray-200">
      <TableRow className="hover:bg-white">
        <TableHead className="text-gray-500 font-medium">Placa</TableHead>
        <TableHead className="text-gray-500 font-medium">Nombre</TableHead>
        <TableHead className="text-gray-500 font-medium">Año fab.</TableHead>
        <TableHead className="text-gray-500 font-medium">Modelo</TableHead>
        <TableHead className="text-center text-gray-500 font-medium">Estado SOAT</TableHead>
        <TableHead className="text-gray-500 font-medium">Próx. revisión</TableHead>
        <TableHead className="text-gray-500 font-medium">Fabricante</TableHead>
        <TableHead className="text-gray-500 font-medium">N° póliza</TableHead>
        <TableHead className="text-gray-500 font-medium">Empresa SOAT</TableHead>
        <TableHead className="text-gray-500 font-medium">Venc. póliza</TableHead>
        <TableHead className="text-center text-gray-500 font-medium">Acciones</TableHead>
      </TableRow>
    </TableHeader>
  );
};
