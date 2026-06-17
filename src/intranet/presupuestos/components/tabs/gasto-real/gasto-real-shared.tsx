import { Button } from "@/shared/components/ui/button";
import { FileText } from "lucide-react";
import { getEvidenciaStaticUrl } from "@/intranet/informes/api/informe.api";
import type { IncidenciaPresupuesto, PresupuestoRealItem } from "@/intranet/presupuestos/interfaces/presupuesto";

export function getIncidenciaValue(item: PresupuestoRealItem): string {
  return item.ID_Incidencia ? String(item.ID_Incidencia) : "NO";
}

export function buildIncidenciaOptions(
  incidencias: IncidenciaPresupuesto[],
  selectedValue: string,
): IncidenciaPresupuesto[] {
  if (selectedValue === "NO") {
    return incidencias;
  }

  const selectedId = Number(selectedValue);
  if (!selectedId || incidencias.some((inc) => inc.id_incidencia === selectedId)) {
    return incidencias;
  }

  return [
    ...incidencias,
    {
      id_incidencia: selectedId,
      comentario: `Incidencia #${selectedId} (guardada)`,
    },
  ];
}

function resolveGastoRealEvidenciaUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return getEvidenciaStaticUrl(trimmed.startsWith("/") ? trimmed : `/${trimmed}`);
}

interface GastoRealEvidenciaButtonProps {
  url?: string | null;
}

export function GastoRealEvidenciaButton({ url }: GastoRealEvidenciaButtonProps) {
  const evidenciaUrl = url?.trim();
  if (!evidenciaUrl) return null;

  const resolvedUrl = resolveGastoRealEvidenciaUrl(evidenciaUrl);

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="gap-1 h-8"
      onClick={() => window.open(resolvedUrl, "_blank", "noopener,noreferrer")}
    >
      <FileText className="h-3 w-3" />
      Ver evidencia
    </Button>
  );
}
