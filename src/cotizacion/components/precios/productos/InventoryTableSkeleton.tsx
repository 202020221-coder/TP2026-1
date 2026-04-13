import type { FC } from "react";
import { TableCell, TableRow } from "@/shared/components/ui/table";
import { Skeleton } from "@/shared/components/ui/skeleton";
export const InventoryTableSkeleton: FC = () => (
  <>
    {Array.from({ length: 6 }).map((_, i) => (
      <TableRow key={i}>
        <TableCell>
          <Skeleton className="h-4 w-[85%] bg-gray-300" />
        </TableCell>

        <TableCell className="text-center">
          <Skeleton className="h-4 w-12 mx-auto bg-gray-300" />
        </TableCell>

        <TableCell>
          <Skeleton className="h-4 w-[70%] bg-gray-300" />
        </TableCell>

        <TableCell className="text-center">
          <Skeleton className="h-4 w-16 mx-auto bg-gray-300" />
        </TableCell>

        <TableCell className="text-center">
          <Skeleton className="h-4 w-16 mx-auto bg-gray-300" />
        </TableCell>

        <TableCell className="text-center">
          <Skeleton className="h-8 w-20 mx-auto bg-gray-300" />
        </TableCell>

        <TableCell className="text-center">
          <Skeleton className="h-8 w-24 mx-auto bg-gray-300" />
        </TableCell>

        <TableCell className="text-right">
          <Skeleton className="h-4 w-16 ml-auto bg-gray-300" />
        </TableCell>

        <TableCell className="text-center">
          <Skeleton className="h-8 w-8 mx-auto bg-gray-300" />
        </TableCell>
      </TableRow>
    ))}
  </>
);
