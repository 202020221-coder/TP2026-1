import type { FC } from "react";
import { TableRow, TableCell } from "@/shared/components/ui/table";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { RolesRecord } from "@/security/session/enum/roles.enum";
import { useSession } from "@/security/session/hooks/stores/useSession.store";
export const OrdersTablePlaceholder: FC<{ rows: number }> = ({ rows }) => {
  const user = useSession((state) => state.loggedUser);

  return (
    <>
      {Array.from({ length: rows }).map((_, idx) => (
        <TableRow
          key={idx}
          className="border-b border-gray-100 hover:bg-transparent"
        >
          <TableCell className="py-3">
            <Skeleton className="h-4 w-16 mb-2 bg-gray-50" />
          </TableCell>
          {user?.rol === RolesRecord.projectAdmin && (
            <TableCell>
              <Skeleton className="h-4 w-24 bg-gray-50" />
            </TableCell>
          )}
          <TableCell>
            <Skeleton className="h-4 w-52 bg-gray-50" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-52 bg-gray-50" />
          </TableCell>
          <TableCell className="text-center">
            <div className="flex justify-center gap-2">
              <Skeleton className="h-8 w-8 rounded bg-gray-50" />
              <Skeleton className="h-8 w-8 rounded bg-gray-50" />
              <Skeleton className="h-8 w-8 rounded bg-gray-50" />
            </div>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};
