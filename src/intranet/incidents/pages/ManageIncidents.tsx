import { useMemo, type ReactNode } from "react";
import { useLocation, useSearchParams } from "react-router";
import { Building2, FileText, Hash, TriangleAlert } from "lucide-react";
import { IncidentsTable } from "../components";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { ListIncidentsProvider } from "../context/ListIncidentsProvider";
import { useIncidents } from "../hooks/useIncidents";
import type { Incident } from "../interfaces/incident";
import {
  type IncidentState,
  IncidentStatesRecord,
} from "../enum/incident-state.record";

type IncidentsNavigationState = {
  projectId?: number;
  projectName?: string | null;
  clientName?: string;
};

export function IncidentsManagementPage() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigationState = location.state as IncidentsNavigationState | null;
  const projectIdRaw = Number(searchParams.get("id_proyecto"));
  const projectId = Number.isInteger(projectIdRaw) && projectIdRaw > 0
    ? projectIdRaw
    : undefined;

  const initialQueryParams = useMemo(
    () => ({
      page: 1,
      limit: 10,
      id_proyecto: projectId,
    }),
    [projectId],
  );

  return (
    <>
      <div className="flex items-center gap-3 mb-5">
        <div className="h-7 w-1 rounded-full bg-primary" />
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Gestionar Incidencias
        </h1>
      </div>

      <ListIncidentsProvider initialQueryParams={initialQueryParams}>
        <IncidentsProjectHeader
          projectId={projectId}
          projectNameFromState={navigationState?.projectName}
          clientNameFromState={navigationState?.clientName}
        />

        <div className="bg-card p-6 rounded-2xl shadow-xs border-2 border-border/80 flex flex-col flex-1 min-h-0 overflow-hidden">
          <IncidentActionsPanel />
        </div>
      </ListIncidentsProvider>
    </>
  );
}

function IncidentActionsPanel() {
  return (
    <div className="flex flex-col gap-4 w-full min-w-0 h-full overflow-y-auto overflow-x-hidden pr-1">
      <div>
        <Button className="h-10 px-5 font-medium">
          Crear cotizacion de incidencia
        </Button>
      </div>

      <div className="w-full min-w-0 overflow-x-auto">
        <IncidentsTable />
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4 w-full min-w-0">
        <Button variant="outline" className="h-10 w-full px-4 justify-center">
          Objetos involucrados
        </Button>
        <Button variant="outline" className="h-10 w-full px-4 justify-center">
          Personal involucrados
        </Button>
        <Button variant="outline" className="h-10 w-full px-4 justify-center">
          Suma de gastos
        </Button>
        <Button variant="outline" className="h-10 w-full px-4 justify-center">
          Ocurrencias de la incidencia
        </Button>
      </div>

      <div className="w-full min-w-0">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Comentarios
        </p>
        <Textarea
          rows={5}
          placeholder="Escribe un comentario sobre la incidencia..."
          className="bg-muted/40 w-full max-w-full min-h-32 resize-y"
        />
      </div>
    </div>
  );
}

function IncidentsProjectHeader({
  projectId,
  projectNameFromState,
  clientNameFromState,
}: {
  projectId?: number;
  projectNameFromState?: string | null;
  clientNameFromState?: string;
}) {
  const { result, queryParams } = useIncidents();

  if (!queryParams.id_proyecto && !projectId) {
    return null;
  }

  const firstIncident = result.data?.data?.[0] as
    | (Incident & { nombre?: string })
    | undefined;

  const incidentName =
    firstIncident?.nombre ??
    (firstIncident ? `Incidencia ${firstIncident.id_incidencia}` : "-");

  const projectName =
    firstIncident?.Cotizacion_Nombre ?? projectNameFromState ?? "-";
  const involvedCompany =
    firstIncident?.empresa_involucrada ?? clientNameFromState ?? "-";

  const statusStyles = new Map<IncidentState, string>([
    [
      IncidentStatesRecord.sinEnviar,
      "bg-gray-100 text-gray-600 border-gray-300",
    ],
    [
      IncidentStatesRecord.enviado,
      "bg-blue-100 text-blue-700 border-blue-300",
    ],
    [
      IncidentStatesRecord.enRevision,
      "bg-amber-100 text-amber-700 border-amber-300",
    ],
    [IncidentStatesRecord.cerrado, "bg-red-100 text-red-700 border-red-300"],
  ]);

  return (
    <div className="bg-card p-5 rounded-xl shadow-xs border mb-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-primary uppercase tracking-widest">
            <Hash size={10} />
            Proyecto
          </span>
          <h2 className="text-lg font-bold tracking-tight text-foreground">
            {`La incidencia del proyecto #${projectId ?? queryParams.id_proyecto}`}
          </h2>
        </div>

        {firstIncident?.estado ? (
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-[13px] font-medium border ${statusStyles.get(firstIncident.estado) ?? "bg-gray-100 text-gray-600 border-gray-300"}`}
          >
            Estado de incidencia: {firstIncident.estado}
          </span>
        ) : (
          <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[13px] font-medium border bg-amber-50 text-amber-700 border-amber-300">
            <TriangleAlert size={14} />
            Sin incidencias registradas para este proyecto
          </span>
        )}
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <InfoField
          icon={<FileText size={10} />}
          label="Nombre del proyecto"
          value={projectName}
        />
        <InfoField
          icon={<Building2 size={10} />}
          label="Empresa involucrada"
          value={involvedCompany}
        />
        <InfoField
          icon={<Hash size={10} />}
          label="Nombre de la incidencia"
          value={incidentName}
        />
      </div>
    </div>
  );
}

function InfoField({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
        {icon}
        {label}
      </span>
      <p className="text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}
