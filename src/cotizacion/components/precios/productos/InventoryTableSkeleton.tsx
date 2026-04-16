import type { FC } from "react";
import { TableCell, TableRow } from "@/shared/components/ui/table";
import { Skeleton } from "@/shared/components/ui/skeleton";
export const InventoryTableSkeleton: FC = () => (
  <>
    {Array.from({ length: 6 }).map((_, i) => (
      <TableRow key={i}>
        <TableCell>
          <Skeleton className="h-4 w-[85%] bg-muted" />
        </TableCell>

        <TableCell className="text-center">
          <Skeleton className="mx-auto h-4 w-12 bg-muted" />
        </TableCell>

        <TableCell>
          <Skeleton className="h-4 w-[70%] bg-muted" />
        </TableCell>

        <TableCell className="text-center">
          <Skeleton className="mx-auto h-4 w-16 bg-muted" />
        </TableCell>

        <TableCell className="text-center">
          <Skeleton className="mx-auto h-4 w-16 bg-muted" />
        </TableCell>

        <TableCell className="text-center">
          <Skeleton className="mx-auto h-8 w-20 bg-muted" />
        </TableCell>

        <TableCell className="text-center">
          <Skeleton className="mx-auto h-8 w-24 bg-muted" />
        </TableCell>

        <TableCell className="text-right">
          <Skeleton className="ml-auto h-4 w-16 bg-muted" />
        </TableCell>

        <TableCell className="text-center">
          <Skeleton className="mx-auto h-8 w-8 bg-muted" />
        </TableCell>
      </TableRow>
    ))}
  </>
);
