import type { FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Package } from "lucide-react";
import type { GetOrderInventario } from "../../interfaces/responses.dto";
import { Badge } from "@/shared/components/ui/badge";

export const OrderDetailsInventorySection: FC<{ inventario: GetOrderInventario[] }> = ({ inventario }) => {
  if (inventario.length === 0) return null;

  return (
    <Card className="border shadow-none">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Package className="h-4 w-4 text-muted-foreground" />
          Productos / Inventario
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3 font-medium text-muted-foreground">Producto</th>
                <th className="text-left py-2 px-3 font-medium text-muted-foreground">Cantidad</th>
                <th className="text-left py-2 px-3 font-medium text-muted-foreground">Intención</th>
                <th className="text-left py-2 px-3 font-medium text-muted-foreground">Precio Unit.</th>
                <th className="text-left py-2 px-3 font-medium text-muted-foreground">Días</th>
              </tr>
            </thead>
            <tbody>
              {inventario.map((item) => (
                <tr key={item.id} className="border-b border-border/50 last:border-0">
                  <td className="py-2.5 px-3 font-medium max-w-[220px] truncate" title={item.nombre}>
                    {item.nombre}
                  </td>
                  <td className="py-2.5 px-3">{item.cantidad}</td>
                  <td className="py-2.5 px-3">
                    <Badge
                      variant="outline"
                      className={`text-xs font-normal ${
                        item.intencion === "comprar"
                          ? "border-blue-300 text-blue-600 bg-blue-50"
                          : "border-amber-300 text-amber-600 bg-amber-50"
                      }`}
                    >
                      {item.intencion === "comprar" ? "Compra" : "Alquiler"}
                    </Badge>
                  </td>
                  <td className="py-2.5 px-3 text-muted-foreground">
                    S/ {parseFloat(item.precio_unitario).toFixed(2)}
                  </td>
                  <td className="py-2.5 px-3 text-muted-foreground">
                    {item.dias_alquilados ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
