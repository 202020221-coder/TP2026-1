import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Building2, FileText, Hash, MessageSquare } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { getIncidentById } from "../api/incident.api";
import { IncidentWorkflowStatus } from "../components/detail/IncidentWorkflowStatus";
import { IncidentQuotationsTable } from "../components/detail/IncidentQuotationsTable";
import { IncidentInvolvedObjects } from "../components/detail/IncidentInvolvedObjects";
import { CreateIncidentQuotationModal } from "../components/detail/CreateIncidentQuotationModal";

export function IncidentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const incidentId = Number(id);
  const [createQuotationOpen, setCreateQuotationOpen] = useState(false);

  const { data: incident, isPending, isError, error } = useQuery({
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
          <div className="flex flex-col gap-6">
            {/* Top row: ID + title */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex flex-col gap-1">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-widest">
                  <Hash size={12} />
                  Incidencia
                </span>
                <p className="text-3xl font-bold text-foreground font-mono">
                  #{incident.id_incidencia}
                </p>
              </div>

              {/* Workflow status */}
              <IncidentWorkflowStatus currentState={incident.estado} />
            </div>

            {/* Detail fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pt-2 border-t border-border">
              {/* Empresa involucrada */}
              <div className="flex flex-col gap-1.5">
                <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  <Building2 size={12} />
                  Empresa Involucrada
                </span>
                <p className="text-sm font-semibold text-foreground font-mono">
                  {incident.empresa_involucrada}
                </p>
              </div>

              {/* Proyecto / Cotización */}
              <div className="flex flex-col gap-1.5">
                <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  <FileText size={12} />
                  Proyecto / Cotización
                </span>
                <p className="text-sm font-semibold text-foreground">
                  {incident.Cotizacion_Nombre ?? (
                    <span className="text-muted-foreground italic font-normal">Sin cotización asociada</span>
                  )}
                </p>
              </div>

              {/* Cliente */}
              <div className="flex flex-col gap-1.5">
                <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  <Building2 size={12} />
                  Cliente
                </span>
                <p className="text-sm font-semibold text-foreground">
                  {incident.Cliente_Nombre}
                </p>
              </div>

              {/* Comentario - full width */}
              <div className="col-span-1 sm:col-span-2 lg:col-span-3 flex flex-col gap-1.5">
                <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  <MessageSquare size={12} />
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

      {/* ── Quotations Table ── */}
      <div className="bg-card rounded-xl shadow-xs border border-border p-6 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <div className="h-5 w-0.5 rounded-full bg-primary" />
          <h2 className="text-base font-semibold text-foreground">Cotizaciones</h2>
        </div>
        <IncidentQuotationsTable incidentId={incidentId} />
      </div>

      {/* ── Involved Objects ── */}
      <IncidentInvolvedObjects incidentId={incidentId} />

      {/* ── Create Quotation Modal ── */}
      <CreateIncidentQuotationModal
        incidentId={incidentId}
        open={createQuotationOpen}
        onClose={() => setCreateQuotationOpen(false)}
      />
    </div>
  );
}

function IncidentInfoSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-20 bg-gray-100" />
          <Skeleton className="h-9 w-16 bg-gray-100" />
        </div>
        <Skeleton className="h-10 w-80 bg-gray-100 rounded-full" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-4 border-t border-border">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-28 bg-gray-100" />
          <Skeleton className="h-4 w-40 bg-gray-100" />
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-24 bg-gray-100" />
          <Skeleton className="h-4 w-36 bg-gray-100" />
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3 w-20 bg-gray-100" />
          <Skeleton className="h-4 w-32 bg-gray-100" />
        </div>
        <div className="col-span-3 flex flex-col gap-2">
          <Skeleton className="h-3 w-36 bg-gray-100" />
          <Skeleton className="h-16 w-full bg-gray-100 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
