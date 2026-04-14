import { Card } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Skeleton } from "@/shared/components/ui/skeleton";
import type { InventoryItem } from "@/cotizacion/interfaces/create/order-inventory";
import { CheckCircle2 } from "lucide-react";

interface CatalogGridProps {
  items: InventoryItem[];
  selectedIds: Set<string>;
  onToggleSelect: (item: InventoryItem, selected: boolean) => void;
  isLoading: boolean;
}

export function CatalogGrid({
  items,
  selectedIds,
  onToggleSelect,
  isLoading,
}: CatalogGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-44 w-full rounded-lg bg-muted" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-dashed border-border py-12">
        <p className="text-sm text-muted-foreground">
          No hay insumos del inventario disponibles
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => {
        const isSelected = selectedIds.has(item.Id_Objeto.toString());
        const formattedPrice = Number(item.precio_comercial).toFixed(2);

        return (
          <Card
            key={item.Id_Objeto}
            className={`cursor-pointer overflow-hidden border bg-card transition-all duration-200 ${
              isSelected
                ? "border-primary bg-primary/5 ring-2 ring-primary/30"
                : "hover:border-primary/40 hover:bg-accent/20"
            }`}
            onClick={() => onToggleSelect(item, isSelected)}
          >
            <div className="space-y-3 p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Item #{item.Id_Objeto}
                  </p>
                  <h3 className="mt-1 line-clamp-2 text-base font-semibold leading-tight text-foreground">
                    {item.nombre_objeto}
                  </h3>
                </div>
                {isSelected && (
                  <CheckCircle2 className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground" />
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="text-xs font-medium">
                  Estado: {item.estado}
                </Badge>
                <Badge variant="outline" className="text-xs font-medium">
                  Stock: {item.cantidad}
                </Badge>
              </div>

              <div className="space-y-1 text-xs text-muted-foreground">
                <p className="line-clamp-1">
                  <span className="font-medium text-foreground/80">Almacén:</span>{" "}
                  {item.lugar_almacenaje}
                </p>
                <p className="line-clamp-1">
                  <span className="font-medium text-foreground/80">Serie:</span>{" "}
                  {item.numero_serial}
                </p>
                <p className="line-clamp-1">
                  <span className="font-medium text-foreground/80">Fabricación:</span>{" "}
                  {item.ano_fabricacion}
                </p>
              </div>

              <div className="flex items-end justify-between border-t border-border/80 pt-2">
                <span className="text-xs font-medium text-muted-foreground">
                  Precio comercial
                </span>
                <span className="text-lg font-bold text-foreground">
                  ${formattedPrice}
                </span>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
