import { TableCell, TableRow } from "@/shared/components/ui/table";
import { AlertCircle } from "lucide-react";
import type { FC } from "react";
export const InventoryTableError: FC<{ message?: string }> = ({
  message = "No se pudieron cargar los ensayos. Intenta recargar la página.",
}) => (
  <TableRow>
    <TableCell colSpan={9} className="text-center py-8">
      <div className="flex flex-col items-center gap-2">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <p className="font-medium text-destructive">{message}</p>
      </div>
    </TableCell>
  </TableRow>
);
