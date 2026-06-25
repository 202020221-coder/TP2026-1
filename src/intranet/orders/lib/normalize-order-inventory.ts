import type { GetOrderResponseDTO } from "../interfaces";

export type RawOrderInventoryItem = GetOrderResponseDTO["inventario"][number] & {
  Id_Objeto?: number;
  Objeto_Nombre?: string;
  nombre_objeto?: string;
  diasAlquilados?: number;
};

export function resolveOrderInventoryObjectId(
  item: RawOrderInventoryItem,
): number {
  const id = item.ID_Inventario ?? item.Id_Objeto ?? 0;
  return Number.isFinite(Number(id)) ? Number(id) : 0;
}

export function resolveOrderInventoryObjectName(
  item: RawOrderInventoryItem,
): string {
  const candidates = [item.Objeto_Nombre, item.nombre_objeto, item.nombre];
  for (const value of candidates) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }

  const id = resolveOrderInventoryObjectId(item);
  return id > 0 ? `Producto #${id}` : "Producto sin nombre";
}

export function normalizeOrderInventoryItem(
  item: RawOrderInventoryItem,
  index: number,
): GetOrderResponseDTO["inventario"][number] {
  const dias =
    Number(item.dias_alquilados) ||
    Number(item.diasAlquilados) ||
    0;

  return {
    ...item,
    id: item.id ?? index + 1,
    ID_Inventario: resolveOrderInventoryObjectId(item),
    nombre: resolveOrderInventoryObjectName(item),
    dias_alquilados: dias,
  };
}

export function normalizeOrderInventory(
  inventario: RawOrderInventoryItem[] | undefined | null,
): GetOrderResponseDTO["inventario"] {
  return (inventario ?? []).map(normalizeOrderInventoryItem);
}
