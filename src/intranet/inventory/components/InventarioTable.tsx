"use client";

import type { FC } from "react";
import { Table, TableBody, TableCell, TableRow } from "@/shared/components/ui/table";
import { useInventario } from "../hooks/useInventario";
import { InventarioTableControls } from "./InventarioTableControls";
import { InventarioTableHeader } from "./InventarioTableHeader";
import { InventarioTablePlaceholder } from "./InventarioTablePlaceholder";
import { InventarioTableRow } from "./InventarioTableRow";

const PLACEHOLDER_ROWS = 8;
const COLUMN_COUNT = 17;

export const InventarioTable: FC<{
  onEdit: (id: number) => void;
  onAdd: () => void;
}> = ({ onEdit, onAdd }) => {
  const { result, filteredItems } = useInventario();
  const { isPending, isFetching, isError, error } = result;

  return (
    <InventarioTableControls onAdd={onAdd}>
      <Table containerClassname="flex-1 overflow-auto flex-col">
        <InventarioTableHeader />
        <TableBody>
          {isPending || isFetching ? (
            <InventarioTablePlaceholder rows={PLACEHOLDER_ROWS} />
          ) : isError ? (
            <TableRow>
              <TableCell colSpan={COLUMN_COUNT} className="text-destructive">
                {error.message}
              </TableCell>
            </TableRow>
          ) : filteredItems.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={COLUMN_COUNT}
                className="text-center text-muted-foreground"
              >
                No hay objetos para los filtros seleccionados.
              </TableCell>
            </TableRow>
          ) : (
            filteredItems.map((item) => (
              <InventarioTableRow
                key={item.Id_Objeto}
                item={item}
                onEdit={onEdit}
              />
            ))
          )}
        </TableBody>
      </Table>
    </InventarioTableControls>
  );
};
