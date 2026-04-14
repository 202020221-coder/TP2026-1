import { Card } from "@/shared/components/ui/card";
// import { Badge } from '@/shared/components/ui/badge'
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
          <Skeleton key={i} className="h-48 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-dashed border-gray-300 py-12">
        <p className="text-sm text-gray-500">
          No hay insumos del inventario disponibles
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => {
        const isSelected = selectedIds.has(item.Id_Objeto.toString());

        return (
          <Card
            key={item.Id_Objeto}
            className={`cursor-pointer overflow-hidden transition-all duration-200 ${
              isSelected
                ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500"
                : "hover:border-gray-400"
            }`}
            onClick={() => onToggleSelect(item, isSelected)}
          >
            <div className="space-y-3 p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {item.nombre_objeto}
                  </h3>
                </div>
                {isSelected && (
                  <CheckCircle2 className="bg-blue-500 flex h-6 w-6 items-center justify-center rounded-full text-white" />
                )}
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-sm font-bold text-gray-900">
                  ${item.precio_comercial}
                </span>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
