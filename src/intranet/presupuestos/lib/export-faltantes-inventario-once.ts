import { presupuestosApi } from "../api/presupuestos.api";
import type {
  ChecklistItemPresupuesto,
  PresupuestoItem,
} from "../interfaces/presupuesto";
import {
  isChecklistExported,
  markChecklistExported,
} from "./checklist-export-storage";

export function faltantesConCosto(items: ChecklistItemPresupuesto[]) {
  return items.filter(
    (item) => item.estancia === "para inventario" && item.costo > 0,
  );
}

export function faltantesAlreadyInPresupuesto(
  faltantes: ChecklistItemPresupuesto[],
  presupuestoItems: PresupuestoItem[],
): boolean {
  const pending = faltantesConCosto(faltantes);
  if (pending.length === 0) return true;

  const exportedNames = new Set(
    presupuestoItems
      .filter(
        (item) =>
          item.tipo === "Material Directo" &&
          item.estancia === "para inventario",
      )
      .map((item) => item.nombre_gasto.trim().toLowerCase()),
  );

  return pending.every((faltante) =>
    exportedNames.has(faltante.nombre_objeto.trim().toLowerCase()),
  );
}

/** Indica si los faltantes ya fueron exportados (localStorage o líneas en presupuesto). */
export async function hasFaltantesBeenExported(
  cotizacionId: number,
): Promise<boolean> {
  if (isChecklistExported(cotizacionId)) return true;

  const [inventarioRes, presupuestoRes] = await Promise.all([
    presupuestosApi.getInventarioPorServicio(cotizacionId),
    presupuestosApi.getItems(cotizacionId, "Material Directo"),
  ]);

  return faltantesAlreadyInPresupuesto(
    inventarioRes.data?.data ?? [],
    presupuestoRes.data ?? [],
  );
}

export type ExportFaltantesOnceResult =
  | { skipped: true; reason: "already_exported" | "no_faltantes" }
  | { skipped: false };

/**
 * Exporta faltantes de inventario al presupuesto como máximo una vez por cotización.
 * Evita duplicar líneas Material Directo si el POST ya se ejecutó (p. ej. al crear la cotización).
 */
export async function exportarFaltantesInventarioOnce(
  cotizacionId: number,
): Promise<ExportFaltantesOnceResult> {
  const [inventarioRes, presupuestoRes] = await Promise.all([
    presupuestosApi.getInventarioPorServicio(cotizacionId),
    presupuestosApi.getItems(cotizacionId, "Material Directo"),
  ]);

  const faltantes = inventarioRes.data?.data ?? [];
  const presupuestoItems = presupuestoRes.data ?? [];

  if (
    isChecklistExported(cotizacionId) ||
    faltantesAlreadyInPresupuesto(faltantes, presupuestoItems)
  ) {
    markChecklistExported(cotizacionId);
    return { skipped: true, reason: "already_exported" };
  }

  if (faltantesConCosto(faltantes).length === 0) {
    markChecklistExported(cotizacionId);
    return { skipped: true, reason: "no_faltantes" };
  }

  await presupuestosApi.exportarFaltantesInventario(cotizacionId);
  markChecklistExported(cotizacionId);
  return { skipped: false };
}
