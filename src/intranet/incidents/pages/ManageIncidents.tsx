import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useLocation, useSearchParams } from "react-router";
import { Building2, FileText, Hash, TriangleAlert } from "lucide-react";
import { IncidentObjectsModal, IncidentsTable } from "../components";
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
  const [objectsModalOpen, setObjectsModalOpen] = useState(false);
  const projectId = Number.isInteger(projectIdRaw) && projectIdRaw > 0
    ? projectIdRaw
    : navigationState?.projectId;

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
        <IncidentsContent
          projectId={projectId}
          projectNameFromState={navigationState?.projectName}
          clientNameFromState={navigationState?.clientName}
          objectsModalOpen={objectsModalOpen}
          onCloseObjectsModal={() => setObjectsModalOpen(false)}
          onOpenObjectsModal={() => setObjectsModalOpen(true)}
        />
      </ListIncidentsProvider>
    </>
  );
}

function IncidentsContent({
  projectId,
  projectNameFromState,
  clientNameFromState,
  objectsModalOpen,
  onCloseObjectsModal,
  onOpenObjectsModal,
}: {
  projectId?: number;
  projectNameFromState?: string | null;
  clientNameFromState?: string;
  objectsModalOpen: boolean;
  onCloseObjectsModal: () => void;
  onOpenObjectsModal: () => void;
}) {
  const { result } = useIncidents();
  const incidents = (result.data?.data ?? []) as Incident[];
  const [selectedIncidentId, setSelectedIncidentId] = useState<number | null>(null);

  useEffect(() => {
    if (incidents.length === 0) {
      setSelectedIncidentId(null);
      return;
    }

    const selectedExists = incidents.some(
      (incident) => incident.id_incidencia === selectedIncidentId,
    );

    if (!selectedExists) {
      setSelectedIncidentId(incidents[0].id_incidencia);
    }
  }, [incidents, selectedIncidentId]);

  const selectedIncident = incidents.find(
    (incident) => incident.id_incidencia === selectedIncidentId,
  ) ?? incidents[0];

  return (
    <>
      <IncidentsProjectHeader
        projectId={projectId}
        projectNameFromState={projectNameFromState}
        clientNameFromState={clientNameFromState}
        selectedIncident={selectedIncident}
      />

      <div className="bg-card p-6 rounded-2xl shadow-xs border-2 border-border/80 flex flex-col flex-1 min-h-0 overflow-hidden">
        <IncidentActionsPanel
          onOpenObjectsModal={onOpenObjectsModal}
          selectedIncidentId={selectedIncident?.id_incidencia}
          onSelectIncident={setSelectedIncidentId}
          selectedIncident={selectedIncident}
        />
      </div>

      <IncidentObjectsSection
        open={objectsModalOpen}
        onClose={onCloseObjectsModal}
        selectedIncidentId={selectedIncident?.id_incidencia}
      />
    </>
  );
}

function IncidentActionsPanel({
  onOpenObjectsModal,
  selectedIncidentId,
  onSelectIncident,
  selectedIncident,
}: {
  onOpenObjectsModal: () => void;
  selectedIncidentId?: number;
  onSelectIncident: (incidentId: number) => void;
  selectedIncident?: Incident;
}) {
  return (
    <div className="flex flex-col gap-4 w-full min-w-0 h-full overflow-y-auto overflow-x-hidden pr-1">
      <div>
        <Button className="h-10 px-5 font-medium">
          Crear cotizacion de incidencia
        </Button>
      </div>

      <div className="w-full min-w-0 overflow-x-auto">
        <IncidentsTable
          selectedIncidentId={selectedIncidentId}
          onSelectIncident={onSelectIncident}
        />
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4 w-full min-w-0">
        <Button
          variant="outline"
          className="h-10 w-full px-4 justify-center"
          onClick={onOpenObjectsModal}
          disabled={!selectedIncidentId}
        >
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
        {!selectedIncidentId ? (
          <p className="mb-2 text-xs text-amber-700">
            Debe existir al menos una incidencia registrada para gestionar objetos involucrados.
          </p>
        ) : null}
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Comentarios
        </p>
        <Textarea
          rows={5}
          placeholder="Escribe un comentario sobre la incidencia..."
          className="bg-muted/40 w-full max-w-full min-h-32 resize-y"
          value={selectedIncident?.comentario ?? ""}
          readOnly
        />
      </div>
    </div>
  );
}

function IncidentObjectsSection({
  open,
  onClose,
  selectedIncidentId,
}: {
  open: boolean;
  onClose: () => void;
  selectedIncidentId?: number;
}) {
  if (!selectedIncidentId) {
    return null;
  }

  return (
    <IncidentObjectsModal
      incidentId={selectedIncidentId}
      open={open}
      onClose={onClose}
    />
  );
}

function IncidentsProjectHeader({
  projectId,
  projectNameFromState,
  clientNameFromState,
  selectedIncident,
}: {
  projectId?: number;
  projectNameFromState?: string | null;
  clientNameFromState?: string;
  selectedIncident?: Incident;
}) {
  const { queryParams } = useIncidents();

  if (!queryParams.id_proyecto && !projectId) {
    return null;
  }

  const incidentName =
    selectedIncident
      ? `Incidencia ${selectedIncident.id_incidencia}`
      : "-";

  const projectName =
    selectedIncident?.Cotizacion_Nombre ?? projectNameFromState ?? "-";
  const involvedCompany =
    selectedIncident?.empresa_involucrada ?? clientNameFromState ?? "-";

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
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-primary uppercase tracking-widest">
            <Hash size={10} />
            Proyecto
          </span>
          <h2 className="text-lg font-bold tracking-tight text-foreground">
            {`La incidencia del proyecto #${projectId ?? queryParams.id_proyecto}`}
          </h2>
        </div>

        {selectedIncident?.estado ? (
          <span
            className={`inline-flex items-center self-start rounded-full px-3 py-1 text-[13px] font-medium border ${statusStyles.get(selectedIncident.estado) ?? "bg-gray-100 text-gray-600 border-gray-300"}`}
          >
            Estado de incidencia: {selectedIncident.estado}
          </span>
        ) : (
          <span className="inline-flex items-center self-start gap-2 rounded-full px-3 py-1 text-[13px] font-medium border bg-amber-50 text-amber-700 border-amber-300">
            <TriangleAlert size={14} />
            Sin incidencias registradas para este proyecto
          </span>
        )}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
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
    <div className="flex h-full flex-col gap-2 rounded-xl border border-border/70 bg-muted/20 p-4">
      <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
        {icon}
        {label}
      </span>
      <p className="min-h-5 text-sm font-semibold leading-snug text-foreground">
        {value}
      </p>
    </div>
  );
}
