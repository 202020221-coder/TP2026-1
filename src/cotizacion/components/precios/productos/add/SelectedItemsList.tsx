import {
  Controller,
  type Control,
  type FieldArrayWithId,
} from "react-hook-form";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { X } from "lucide-react";
import type { SelectInventoryFormType } from "@/cotizacion/schemas/addInventoryItem";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { OrderInventoryIntentionsRecord } from "@/cotizacion/enum/order-inventory-intention";

interface SelectedItemsListProps {
  control: Control<SelectInventoryFormType>;
  selectedItems: FieldArrayWithId<SelectInventoryFormType, "items", "id">[];
  onRemoveItem: (itemId: string, index: number) => void;
}

export function SelectedItemsList({
  selectedItems,
  onRemoveItem,
  control,
}: SelectedItemsListProps) {
  if (selectedItems.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-dashed border-border py-8">
        <p className="text-sm text-muted-foreground">
          No items selected. Select items from the catalog above.
        </p>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">
          Selected Items ({selectedItems.length})
        </h3>
      </div>

      <ScrollArea className="max-h-80 overflow-y-auto rounded-lg border border-border bg-card">
        <div className="space-y-2 p-4">
          {selectedItems.map((field, index) => (
            <Card key={field.id} className="overflow-hidden bg-muted/30 p-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-foreground">
                        {field.nombre}
                      </h4>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Precio Comercial: ${field.precio_comercial.toFixed(2)}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveItem(field.idInventario, index)}
                    className="h-6 w-6 p-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">
                      Cantidad
                    </label>
                    <Controller
                      name={`items.${index}.cantidad`}
                      control={control}
                      render={({ field }) => (
                        <Input
                          type="number"
                          min="1"
                          max="1000"
                          placeholder="Qty"
                          {...field}
                          className="h-8 text-xs"
                        />
                      )}
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">
                      Precio Unit.
                    </label>
                    <Controller
                      name={`items.${index}.precio_unitario`}
                      control={control}
                      render={({ field }) => (
                        <Input
                          type="number"
                          step="0.01"
                          min="0.01"
                          placeholder="Price"
                          {...field}
                          className="h-8 text-xs"
                        />
                      )}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">
                    Intención
                  </label>
                  <Controller
                    name={`items.${index}.intencion`}
                    control={control}
                    render={({ field, fieldState }) => (
                      <Select name={field.name} value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger
                          aria-invalid={fieldState.invalid}
                          className="h-8 text-xs"
                        >
                          <SelectValue placeholder="Seleccione la intención" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(OrderInventoryIntentionsRecord).map(
                            (value, i) => (
                              <SelectItem key={`${i}-${value}`} value={value}>
                                {value}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
