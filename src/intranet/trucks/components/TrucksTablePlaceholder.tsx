import type { FC } from "react";
import { TableRow, TableCell } from "@/shared/components/ui/table";
import { Skeleton } from "@/shared/components/ui/skeleton";

export const TrucksTablePlaceholder: FC<{ rows: number }> = ({ rows }) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, idx) => (
        <TableRow key={idx} className="border-b border-gray-100 hover:bg-transparent">
          <TableCell className="py-3">
            <Skeleton className="h-4 w-20 bg-gray-50" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-32 bg-gray-50" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-10 bg-gray-50" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-24 bg-gray-50" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-6 w-24 rounded-full bg-gray-50" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-6 w-24 rounded-full bg-gray-50" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-24 bg-gray-50" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-28 bg-gray-50" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-20 bg-gray-50" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-28 bg-gray-50" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-24 bg-gray-50" />
          </TableCell>
          <TableCell className="text-right">
            <div className="flex justify-end gap-2">
              <Skeleton className="h-8 w-24 bg-gray-50" />
              <Skeleton className="h-8 w-32 bg-gray-50" />
            </div>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};
