import type { FC } from "react";
import { TableHeader, TableHead, TableRow } from "@/shared/components/ui/table";
import { useSession } from "@/profile/hooks/stores/useSession.store";
import { RolesRecord } from "@/profile/enum/roles.enum";
export const OrdersTableHeader: FC = () => {
  const user = useSession((state) => state.loggedUser);
  return (
    <TableHeader className="[&_tr]:border-b border-gray-200">
      <TableRow className="hover:bg-white">
        <TableHead className="text-gray-500 font-medium">Código</TableHead>
        <TableHead className="text-gray-500 font-medium">
          {user?.rol === RolesRecord.projectAdmin && `ID Cliente`}
          {user?.rol === RolesRecord.client && `ID Empresa`}
        </TableHead>
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
      </TableRow>
    </TableHeader>
  );
};
