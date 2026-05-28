import type { FC } from "react";
import { TableRow, TableCell } from "@/shared/components/ui/table";
import { Skeleton } from "@/shared/components/ui/skeleton";

const COLUMN_COUNT = 17;

export const InventarioTablePlaceholder: FC<{ rows: number }> = ({ rows }) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, idx) => (
        <TableRow
          key={idx}
          className="border-b border-gray-100 hover:bg-transparent"
        >
          {Array.from({ length: COLUMN_COUNT }).map((__, cellIdx) => (
            <TableCell
              key={cellIdx}
              className={cellIdx === COLUMN_COUNT - 1 ? "text-right" : undefined}
            >
              <Skeleton
                className={
                  cellIdx === COLUMN_COUNT - 1
                    ? "h-8 w-20 bg-gray-50"
                    : "h-4 w-24 bg-gray-50"
                }
              />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
};
