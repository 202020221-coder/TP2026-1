import type { FC } from "react";
import { TableHeader, TableHead, TableRow } from "@/shared/components/ui/table";

export const InventarioTableHeader: FC = () => {
  return (
    <TableHeader className="[&_tr]:border-b border-gray-200">
      <TableRow className="hover:bg-white">
        <TableHead className="text-gray-500 font-medium">ID</TableHead>
        <TableHead className="text-gray-500 font-medium">Objeto</TableHead>
        <TableHead className="text-gray-500 font-medium">Fabricante</TableHead>
        <TableHead className="text-center text-gray-500 font-medium">Estado</TableHead>
        <TableHead className="text-gray-500 font-medium">Cantidad</TableHead>
        <TableHead className="text-gray-500 font-medium">Merma/Perdida</TableHead>
        <TableHead className="text-gray-500 font-medium">Ubicacion</TableHead>
        <TableHead className="text-gray-500 font-medium">Orden compra</TableHead>
        <TableHead className="text-gray-500 font-medium">Fecha compra</TableHead>
        <TableHead className="text-gray-500 font-medium">Precio compra</TableHead>
        <TableHead className="text-gray-500 font-medium">Precio envio</TableHead>
        <TableHead className="text-gray-500 font-medium">Precio comercial</TableHead>
        <TableHead className="text-gray-500 font-medium">Garantia</TableHead>
        <TableHead className="text-center text-gray-500 font-medium">Mant. req.</TableHead>
        <TableHead className="text-gray-500 font-medium">Ult. mant.</TableHead>
        <TableHead className="text-gray-500 font-medium">Venc. mant.</TableHead>
        <TableHead className="text-center text-gray-500 font-medium">Acciones</TableHead>
      </TableRow>
    </TableHeader>
  );
};
