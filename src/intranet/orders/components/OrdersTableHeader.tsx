import type { FC } from "react";
import { TableHeader, TableHead, TableRow } from "@/shared/components/ui/table";
import { useSession } from "@/security/session/hooks/stores/useSession.store";
import { RolesRecord } from "@/security/session/enum/roles.enum";
export const OrdersTableHeader: FC = () => {
  const user = useSession((state) => state.loggedUser);
  return (
    <TableHeader className="[&_tr]:border-b border-gray-200">
      <TableRow className="hover:bg-white">
        <TableHead className="text-gray-500 font-medium">ID</TableHead>
        {user?.rol === RolesRecord.projectAdmin && (
          <TableHead className="text-gray-500 font-medium">
            {user?.rol === RolesRecord.projectAdmin && `Nombre del cliente`}
          </TableHead>
        )}
        <TableHead className="text-gray-500 font-medium">Ubicación</TableHead>
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
