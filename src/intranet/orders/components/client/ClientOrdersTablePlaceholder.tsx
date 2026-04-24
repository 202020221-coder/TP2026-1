import type { FC } from "react";
import { TableRow, TableCell } from "@/shared/components/ui/table";
import { Skeleton } from "@/shared/components/ui/skeleton";

export const ClientOrdersTablePlaceholder: FC<{ rows: number }> = ({ rows }) => {
    return (
        <>
            {Array.from({ length: rows }).map((_, idx) => (
                <TableRow key={idx} className="border-b border-gray-100 hover:bg-transparent">
                    <TableCell className="py-3">
                        <Skeleton className="h-4 w-16 mb-2 bg-gray-50" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-4 w-24 bg-gray-50" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-4 w-52 bg-gray-50" />
                    </TableCell>
                    <TableCell>
                        <Skeleton className="h-4 w-40 bg-gray-50" />
                    </TableCell>
                    <TableCell className="text-center">
                        <Skeleton className="h-6 w-20 mx-auto rounded-full bg-gray-50" />
                    </TableCell>
                    <TableCell className="text-center">
                        <Skeleton className="h-8 w-8 mx-auto rounded bg-gray-50" />
                    </TableCell>
                    <TableCell className="text-center">
                        <Skeleton className="h-8 w-8 mx-auto rounded bg-gray-50" />
                    </TableCell>
                </TableRow>
            ))}
        </>
    );
};