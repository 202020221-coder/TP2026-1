import { TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
export const InventoryTableHeader = () => {
  return (
    <TableHeader className="bg-muted/50 sticky top-0 z-10">
      <TableRow>
        <TableHead className="w-[280px]">Producto</TableHead>

        <TableHead className="w-[90px] text-center">ID</TableHead>

        <TableHead className="w-[180px]">Fabricante</TableHead>

        <TableHead className="w-[120px] text-center">Estado</TableHead>

        <TableHead className="w-[120px] text-center">Intención</TableHead>

        <TableHead className="w-[120px] text-center">Cantidad</TableHead>

        <TableHead className="w-[130px] text-center">P.Unit</TableHead>

        <TableHead className="w-[140px] text-right">Subtotal</TableHead>

        <TableHead className="w-[80px] text-center">Acción</TableHead>
      </TableRow>
    </TableHeader>
  );
};
