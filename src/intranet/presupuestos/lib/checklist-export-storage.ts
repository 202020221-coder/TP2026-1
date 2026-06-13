const STORAGE_KEY = "presupuesto-checklist-exportado";

function readExportedIds(): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed)
      ? parsed.filter((id): id is number => typeof id === "number")
      : [];
  } catch {
    return [];
  }
}

export function isChecklistExported(cotizacionId: number): boolean {
  return readExportedIds().includes(cotizacionId);
}

export function markChecklistExported(cotizacionId: number): void {
  const ids = readExportedIds();
  if (ids.includes(cotizacionId)) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids, cotizacionId]));
}
