import type { FC } from "react";
import { TableHeader, TableHead, TableRow } from "@/shared/components/ui/table";

export const ClientOrdersTableHeader: FC = () => {
    return (
        <TableHeader className="[&_tr]:border-b border-gray-200">
            <TableRow className="hover:bg-white">
                <TableHead className="text-gray-500 font-medium">Código</TableHead>
                <TableHead className="text-gray-500 font-medium">ID Cliente</TableHead>
                <TableHead className="text-gray-500 font-medium">Ubicación</TableHead>
                <TableHead className="text-gray-500 font-medium">
                    Fecha de Inicio
                </TableHead>
                <TableHead className="text-center text-gray-500 font-medium">
                    Estado
                </TableHead>
                <TableHead className="text-center text-gray-500 font-medium">
                    Acciones
                </TableHead>
                <TableHead className="text-center text-gray-500 font-medium">
                    Mensaje
                </TableHead>
            </TableRow>
        </TableHeader>
    );
};