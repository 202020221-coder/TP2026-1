import type { FC } from "react";
import { TableRow, TableCell } from "@/shared/components/ui/table";
import { Skeleton } from "@/shared/components/ui/skeleton";

export const ServiciosTablePlaceholder: FC<{ rows: number }> = ({ rows }) => (
  <>
    {Array.from({ length: rows }).map((_, idx) => (
      <TableRow key={idx} className="border-b border-gray-100 hover:bg-transparent">
        <TableCell className="py-3"><Skeleton className="h-4 w-36 bg-gray-100" /></TableCell>
        <TableCell><Skeleton className="h-4 w-48 bg-gray-100" /></TableCell>
        <TableCell><Skeleton className="h-4 w-16 bg-gray-100" /></TableCell>
        <TableCell><Skeleton className="h-4 w-24 bg-gray-100" /></TableCell>
        <TableCell><Skeleton className="h-4 w-56 bg-gray-100" /></TableCell>
        <TableCell className="text-center">
          <div className="flex justify-center gap-2">
            <Skeleton className="h-8 w-8 rounded bg-gray-100" />
            <Skeleton className="h-8 w-8 rounded bg-gray-100" />
            <Skeleton className="h-8 w-8 rounded bg-gray-100" />
          </div>
        </TableCell>
      </TableRow>
    ))}
  </>
);
