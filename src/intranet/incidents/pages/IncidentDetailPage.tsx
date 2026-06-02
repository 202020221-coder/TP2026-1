import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Building2,
  FileText,
  Hash,
  MessageSquare,
  Package,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { getIncidentById } from "../api/incident.api";
import { IncidentWorkflowStatus } from "../components/detail/IncidentWorkflowStatus";
import { IncidentQuotationsTable } from "../components/detail/IncidentQuotationsTable";
import { CreateIncidentQuotationModal } from "../components/detail/CreateIncidentQuotationModal";
import { IncidentObjectsModal } from "../components/detail/IncidentObjectsModal";

export function IncidentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const incidentId = Number(id);
  const [createQuotationOpen, setCreateQuotationOpen] = useState(false);
  const [objectsModalOpen, setObjectsModalOpen] = useState(false);

  const {
    data: incident,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["incident", incidentId],
    queryFn: () => getIncidentById(incidentId),
    enabled: !isNaN(incidentId),
  });

  return (
    <div className="flex flex-col gap-6 px-6">
      {/* ── Page Header ── */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          title="Volver"
        >
          <ArrowLeft size={16} />
        </Button>
        <div className="h-7 w-1 rounded-full bg-primary" />
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Gestionar Incidencia
        </h1>
      </div>

      {/* ── Info Card ── */}
      <div className="bg-card rounded-xl shadow-xs border border-border p-6">
        {isPending ? (
          <IncidentInfoSkeleton />
        ) : isError ? (
          <p className="text-red-500 text-sm">{error.message}</p>
        ) : incident ? (
          <div className="flex flex-col gap-5">
            {/* Top section: ID badge + Estado workflow */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              {/* Left: Incident ID */}
              <div className="flex flex-col gap-0.5">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-primary uppercase tracking-widest">
                  <Hash size={10} />
                  Incidencia
                </span>
                <p className="text-4xl font-bold text-foreground font-mono leading-none">
                  #{incident.id_incidencia}
                </p>
              </div>

              {/* Right: Estado workflow stepper */}
              <IncidentWorkflowStatus currentState={incident.estado} />
            </div>

            {/* Separator */}
            <div className="border-t border-border" />

            {/* Detail fields — vertical stack aligned like wireframe */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-4">
              {/* Empresa involucrada */}
              <div className="flex flex-col gap-1">
                <span className="flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  <Building2 size={10} />
                  Empresa involucrada
                </span>
                <p className="text-sm font-semibold text-foreground">
                  {incident.empresa_involucrada}
                </p>
              </div>

              {/* Proyecto / Cotización */}
              <div className="flex flex-col gap-1">
                <span className="flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  <FileText size={10} />
                  Proyecto / Cotización
                </span>
                <p className="text-sm font-semibold text-foreground">
                  {incident.Cotizacion_Nombre ?? (
                    <span className="text-muted-foreground italic font-normal text-xs">
                      Sin cotización asociada
                    </span>
                  )}
                </p>
              </div>

              {/* Cliente */}
              <div className="flex flex-col gap-1">
                <span className="flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  <Building2 size={10} />
                  Cliente
                </span>
                <p className="text-sm font-semibold text-foreground">
                  {incident.Cliente_Nombre}
                </p>
              </div>

              {/* Comentario — full width */}
              <div className="col-span-1 sm:col-span-3 flex flex-col gap-1">
                <span className="flex items-center gap-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  <MessageSquare size={10} />
                  Comentarios generales
                </span>
                <p className="text-sm text-foreground leading-relaxed bg-muted/40 rounded-lg px-4 py-3 border border-border">
                  {incident.comentario}
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <div className="flex justify-start pt-1">
              <Button
                onClick={() => setCreateQuotationOpen(true)}
                className="gap-2 px-5 py-2.5 font-medium"
              >
                Crear cotización de incidencia
              </Button>
            </div>
          </div>
        ) : null}
      </div>

      {/* ── Cotizaciones Table ── */}
      <div className="bg-card rounded-xl shadow-xs border border-border p-6 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <div className="h-5 w-0.5 rounded-full bg-primary" />
          <h2 className="text-base font-semibold text-foreground">
            Cotizaciones
          </h2>
        </div>
        <IncidentQuotationsTable incidentId={incidentId} />
      </div>

      {/* ── Objetos involucrados ── (button → modal) */}
      <div className="bg-card rounded-xl shadow-xs border border-border p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-5 w-0.5 rounded-full bg-primary" />
            <h2 className="text-base font-semibold text-foreground">
              Objetos involucrados
            </h2>
            <span className="text-xs text-muted-foreground">
              — gestionar objetos asociados a esta incidencia
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 font-medium"
            onClick={() => setObjectsModalOpen(true)}
          >
            <Package size={14} />
            Objetos involucrados
          </Button>
        </div>
      </div>

      {/* ── Modals ── */}
      <CreateIncidentQuotationModal
        incidentId={incidentId}
        open={createQuotationOpen}
        onClose={() => setCreateQuotationOpen(false)}
      />

      <IncidentObjectsModal
        incidentId={incidentId}
        open={objectsModalOpen}
        onClose={() => setObjectsModalOpen(false)}
      />
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function IncidentInfoSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-20 bg-gray-100" />
          <Skeleton className="h-10 w-20 bg-gray-100" />
        </div>
        <Skeleton className="h-10 w-80 bg-gray-100 rounded-full" />
      </div>
      <div className="border-t border-border" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-4">
        {[28, 36, 24].map((w, i) => (
          <div key={i} className="flex flex-col gap-2">
            <Skeleton className="h-3 bg-gray-100" style={{ width: `${w * 3}px` }} />
            <Skeleton className="h-4 bg-gray-100" style={{ width: `${w * 4}px` }} />
          </div>
        ))}
        <div className="col-span-1 sm:col-span-3 flex flex-col gap-2">
          <Skeleton className="h-3 w-36 bg-gray-100" />
          <Skeleton className="h-16 w-full bg-gray-100 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
