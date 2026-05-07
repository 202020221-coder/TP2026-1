import type { FC } from "react";
import { TableRow, TableCell } from "@/shared/components/ui/table";
import { Skeleton } from "@/shared/components/ui/skeleton";

export const ProjectsTablePlaceholder: FC<{ rows: number }> = ({ rows }) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, idx) => (
        <TableRow
          key={idx}
          className="border-b border-gray-100 hover:bg-transparent"
        >
          <TableCell className="py-3">
            <Skeleton className="h-4 w-20 bg-gray-100" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-24 bg-gray-100" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-24 bg-gray-100" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-20 bg-gray-100" />
          </TableCell>
          <TableCell className="text-center">
            <Skeleton className="h-6 w-24 mx-auto rounded-full bg-gray-100" />
          </TableCell>
          <TableCell className="text-center">
            <Skeleton className="h-8 w-16 mx-auto rounded bg-gray-100" />
          </TableCell>
          <TableCell className="text-center">
            <Skeleton className="h-4 w-20 mx-auto bg-gray-100" />
          </TableCell>
          <TableCell className="text-center">
            <Skeleton className="h-8 w-20 mx-auto rounded bg-gray-100" />
          </TableCell>
          <TableCell className="text-center">
            <Skeleton className="h-8 w-16 mx-auto rounded bg-gray-100" />
          </TableCell>
          <TableCell className="text-center">
            <Skeleton className="h-8 w-16 mx-auto rounded bg-gray-100" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};
