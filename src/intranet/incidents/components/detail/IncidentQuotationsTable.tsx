import { useState, type FC } from "react";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/shared/components/ui/table";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import {
  Eye,
  MessageCircle,
  Pencil,
  FileCheck,
} from "lucide-react";
import type { IncidentQuotation } from "../../interfaces/incident-quotation";
import type { QuotationState } from "../../enum/quotation-state.record";
import { QuotationCommentsModal } from "./QuotationCommentsModal";

// ── Badge style map (all states) ──────────────────────────────────────────────
const quotationStatusStyles = new Map<QuotationState, string>([
  ["Pendiente",      "bg-gray-100 text-gray-600 border-gray-300"],
  ["Enviado",        "bg-blue-100 text-blue-700 border-blue-300"],
  ["Aprobado",       "bg-green-100 text-green-700 border-green-300"],
  ["Rechazado",      "bg-red-100 text-red-700 border-red-300"],
  ["Disputado",      "bg-orange-100 text-orange-700 border-orange-300"],
  ["Pago realizado", "bg-violet-100 text-violet-700 border-violet-300"],
]);

// ── Mock data (replace with real API call when backend is ready) ─────────────
const MOCK_QUOTATIONS: IncidentQuotation[] = [
  {
    id: 1,
    id_incidencia: 0,
    nombre: "COT-INC-001",
    fecha_envio: "2025-05-10",
    version: 1,
    precio_subtotal: 15800.0,
    estado: "Aprobado",
    mensajes: 3,
    mensajes_pendientes: 0,
  },
  {
    id: 2,
    id_incidencia: 0,
    nombre: "COT-INC-002",
    fecha_envio: "2025-05-18",
    version: 2,
    precio_subtotal: 17200.5,
    estado: "Enviado",
    mensajes: 4,
    mensajes_pendientes: 2,
  },
  {
    id: 3,
    id_incidencia: 0,
    nombre: "COT-INC-003",
    fecha_envio: null,
    version: 3,
    precio_subtotal: null,
    estado: "Pendiente",
    mensajes: 0,
    mensajes_pendientes: 0,
  },
  {
    id: 4,
    id_incidencia: 0,
    nombre: "COT-INC-004",
    fecha_envio: "2025-05-22",
    version: 1,
    precio_subtotal: 18900.0,
    estado: "Disputado",
    mensajes: 6,
    mensajes_pendientes: 3,
  },
  {
    id: 5,
    id_incidencia: 0,
    nombre: "COT-INC-005",
    fecha_envio: "2025-05-28",
    version: 2,
    precio_subtotal: 22500.0,
    estado: "Pago realizado",
    mensajes: 2,
    mensajes_pendientes: 0,
  },
];

interface IncidentQuotationsTableProps {
  incidentId: number;
}

export const IncidentQuotationsTable: FC<IncidentQuotationsTableProps> = ({
  incidentId,
}) => {
  // NOTE: replace isFetching with a real useQuery hook once the endpoint exists
  const isFetching = false;
  const quotations = MOCK_QUOTATIONS.map((q) => ({
    ...q,
    id_incidencia: incidentId,
  }));

  const [commentsOpen, setCommentsOpen] = useState<number | null>(null);

  return (
    <>
      {commentsOpen !== null && (
        <QuotationCommentsModal
          quotationId={commentsOpen}
          open
          onClose={() => setCommentsOpen(null)}
        />
      )}

      <div className="overflow-x-auto rounded-lg border border-border">
        <Table>
          {/* ── Header ── */}
          <TableHeader className="[&_tr]:border-b border-gray-200">
            <TableRow className="hover:bg-transparent bg-muted/30">
              <TableHead className="text-gray-500 font-medium text-xs uppercase tracking-wide">
                Nombre
              </TableHead>
              <TableHead className="text-gray-500 font-medium text-xs uppercase tracking-wide">
                Fecha Envío
              </TableHead>
              <TableHead className="text-center text-gray-500 font-medium text-xs uppercase tracking-wide">
                Versión
              </TableHead>
              <TableHead className="text-center text-gray-500 font-medium text-xs uppercase tracking-wide">
                Precio Subtotal
              </TableHead>
              <TableHead className="text-center text-gray-500 font-medium text-xs uppercase tracking-wide">
                Estado
              </TableHead>
              <TableHead className="text-center text-gray-500 font-medium text-xs uppercase tracking-wide">
                Mensajes
              </TableHead>
              <TableHead className="text-center text-gray-500 font-medium text-xs uppercase tracking-wide">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>

          {/* ── Body ── */}
          <TableBody>
            {isFetching ? (
              <QuotationTableSkeleton />
            ) : quotations.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-gray-400 py-10 text-sm italic"
                >
                  No hay cotizaciones registradas para esta incidencia.
                </TableCell>
              </TableRow>
            ) : (
              quotations.map((q) => (
                <QuotationTableRow
                  key={q.id}
                  quotation={q}
                  onOpenComments={() => setCommentsOpen(q.id)}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer note */}
      {quotations.length > 0 && (
        <p className="text-xs text-muted-foreground text-right mt-1">
          {quotations.length} cotización{quotations.length !== 1 ? "es" : ""} —
          cada edición genera una nueva versión
        </p>
      )}
    </>
  );
};

// ── Single row ────────────────────────────────────────────────────────────────
const QuotationTableRow: FC<{
  quotation: IncidentQuotation;
  onOpenComments: () => void;
}> = ({ quotation, onOpenComments }) => {
  const badgeClass =
    quotationStatusStyles.get(quotation.estado) ??
    "bg-gray-100 text-gray-600 border-gray-300";

  const hasPending = (quotation.mensajes_pendientes ?? 0) > 0;

  return (
    <TableRow className="border-b border-gray-100 hover:bg-gray-50/70 transition-colors">
      {/* Nombre */}
      <TableCell className="font-medium text-gray-800 font-mono text-sm">
        {quotation.nombre}
      </TableCell>

      {/* Fecha envío */}
      <TableCell className="text-gray-600 text-sm">
        {quotation.fecha_envio ? (
          new Date(quotation.fecha_envio).toLocaleDateString("es-PE", {
            year: "numeric",
            month: "short",
            day: "2-digit",
          })
        ) : (
          <span className="text-gray-400 italic text-sm">—</span>
        )}
      </TableCell>

      {/* Versión */}
      <TableCell className="text-center">
        <span className="inline-flex items-center justify-center h-6 min-w-[1.5rem] px-1.5 rounded-full bg-muted text-xs font-semibold text-muted-foreground border border-border">
          v{quotation.version}
        </span>
      </TableCell>

      {/* Precio subtotal */}
      <TableCell className="text-center text-gray-700">
        {quotation.precio_subtotal !== null ? (
          <span className="font-mono text-sm">
            S/{" "}
            {quotation.precio_subtotal.toLocaleString("es-PE", {
              minimumFractionDigits: 2,
            })}
          </span>
        ) : (
          <span className="text-gray-400 italic text-sm">—</span>
        )}
      </TableCell>

      {/* Estado badge */}
      <TableCell className="text-center">
        <span
          className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold border ${badgeClass}`}
        >
          {quotation.estado}
        </span>
      </TableCell>

      {/* Mensajes — badge amarillo si hay pendientes */}
      <TableCell className="text-center">
        <button
          onClick={onOpenComments}
          className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-primary transition-colors group"
          title="Ver mensajes"
        >
          <MessageCircle
            size={14}
            className="group-hover:text-primary transition-colors"
          />
          <span className="text-xs font-medium">{quotation.mensajes}</span>
          {hasPending && (
            <span className="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 rounded-full bg-amber-100 text-amber-700 border border-amber-300 text-[10px] font-bold leading-none">
              {quotation.mensajes_pendientes} pend.
            </span>
          )}
        </button>
      </TableCell>

      {/* Acciones — icon-only, compact */}
      <TableCell className="text-center">
        <div className="flex items-center justify-center gap-0.5">
          {/* Ver */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
                aria-label="Ver cotización"
              >
                <Eye className="w-3.5 h-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent
              side="top"
              className="text-xs"
            >
              Ver cotización
            </TooltipContent>
          </Tooltip>

          {/* Editar */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-blue-500 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                aria-label="Editar cotización"
              >
                <Pencil className="w-3.5 h-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs">
              Editar cotización (crea nueva versión)
            </TooltipContent>
          </Tooltip>

          {/* Ver OC */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-violet-500 hover:text-violet-700 hover:bg-violet-50 transition-colors"
                aria-label="Ver orden de compra"
              >
                <FileCheck className="w-3.5 h-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs">
              Ver orden de compra
            </TooltipContent>
          </Tooltip>
        </div>
      </TableCell>
    </TableRow>
  );
};

// ── Skeleton rows ─────────────────────────────────────────────────────────────
const QuotationTableSkeleton: FC = () => (
  <>
    {Array.from({ length: 3 }).map((_, i) => (
      <TableRow key={i} className="border-b border-gray-100 hover:bg-transparent">
        <TableCell><Skeleton className="h-4 w-32 bg-gray-100" /></TableCell>
        <TableCell><Skeleton className="h-4 w-24 bg-gray-100" /></TableCell>
        <TableCell className="text-center">
          <Skeleton className="h-6 w-8 rounded-full mx-auto bg-gray-100" />
        </TableCell>
        <TableCell className="text-center">
          <Skeleton className="h-4 w-24 mx-auto bg-gray-100" />
        </TableCell>
        <TableCell className="text-center">
          <Skeleton className="h-5 w-20 rounded-full mx-auto bg-gray-100" />
        </TableCell>
        <TableCell className="text-center">
          <Skeleton className="h-4 w-10 mx-auto bg-gray-100" />
        </TableCell>
        <TableCell className="text-center">
          <Skeleton className="h-7 w-20 mx-auto bg-gray-100 rounded" />
        </TableCell>
      </TableRow>
    ))}
  </>
);
