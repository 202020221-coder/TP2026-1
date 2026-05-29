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

// ── Badge style map ──────────────────────────────────────────────────────────
const quotationStatusStyles = new Map<QuotationState, string>([
  ["Pendiente", "bg-gray-100 text-gray-600 border-gray-300"],
  ["Enviado", "bg-blue-100 text-blue-700 border-blue-300"],
  ["Rechazado", "bg-red-100 text-red-700 border-red-300"],
  ["Aprobado", "bg-green-100 text-green-700 border-green-300"],
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
  },
  {
    id: 2,
    id_incidencia: 0,
    nombre: "COT-INC-002",
    fecha_envio: "2025-05-18",
    version: 2,
    precio_subtotal: 17200.5,
    estado: "Enviado",
    mensajes: 1,
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
            <TableRow className="hover:bg-white">
              <TableHead className="text-gray-500 font-medium">Nombre</TableHead>
              <TableHead className="text-gray-500 font-medium">Fecha Envío</TableHead>
              <TableHead className="text-center text-gray-500 font-medium">Versión</TableHead>
              <TableHead className="text-center text-gray-500 font-medium">Precio Subtotal</TableHead>
              <TableHead className="text-center text-gray-500 font-medium">Estado</TableHead>
              <TableHead className="text-center text-gray-500 font-medium">Mensajes</TableHead>
              <TableHead className="text-center text-gray-500 font-medium">Acciones</TableHead>
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
                  className="text-center text-gray-400 py-10"
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

      {/* Pagination note */}
      {quotations.length > 0 && (
        <p className="text-xs text-muted-foreground text-right">
          {quotations.length} cotización{quotations.length !== 1 ? "es" : ""} —
          cada edición genera una nueva versión
        </p>
      )}
    </>
  );
};

// ── Single row ───────────────────────────────────────────────────────────────
const QuotationTableRow: FC<{
  quotation: IncidentQuotation;
  onOpenComments: () => void;
}> = ({ quotation, onOpenComments }) => {
  const badgeClass =
    quotationStatusStyles.get(quotation.estado) ??
    "bg-gray-100 text-gray-600 border-gray-300";

  return (
    <TableRow className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      {/* Nombre */}
      <TableCell className="font-medium text-gray-800">
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
        <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-muted text-xs font-semibold text-muted-foreground border border-border">
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
          className={`inline-block rounded-full px-3 py-1 text-[13px] font-medium border ${badgeClass}`}
        >
          {quotation.estado}
        </span>
      </TableCell>

      {/* Mensajes */}
      <TableCell className="text-center">
        <button
          onClick={onOpenComments}
          className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-primary transition-colors"
          title="Ver mensajes"
        >
          <MessageCircle size={14} />
          {quotation.mensajes}
        </button>
      </TableCell>

      {/* Acciones */}
      <TableCell className="text-center">
        <div className="flex items-center justify-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 text-gray-600 border-gray-300 bg-white hover:bg-gray-100 hover:text-gray-700 hover:border-gray-400 transition-colors"
              >
                <Eye className="w-3.5 h-3.5 mr-1" />
                Ver
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-white border border-gray-400 text-gray-600">
              Ver cotización
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 text-blue-600 border-blue-300 bg-white hover:bg-blue-50 hover:text-blue-700 hover:border-blue-500 transition-colors"
                onClick={onOpenComments}
              >
                <MessageCircle className="w-3.5 h-3.5 mr-1" />
                Comentarios
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-white border border-blue-400 text-blue-600">
              Ver comentarios de la cotización
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 text-gray-600 border-gray-300 bg-white hover:bg-gray-100 hover:text-gray-700 hover:border-gray-400 transition-colors"
              >
                <Pencil className="w-3.5 h-3.5 mr-1" />
                Editar
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-white border border-gray-400 text-gray-600">
              Editar cotización (crea nueva versión)
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 text-violet-600 border-violet-300 bg-white hover:bg-violet-50 hover:text-violet-700 hover:border-violet-500 transition-colors"
              >
                <FileCheck className="w-3.5 h-3.5 mr-1" />
                Ver OC
              </Button>
            </TooltipTrigger>
            <TooltipContent className="bg-white border border-violet-400 text-violet-600">
              Ver orden de compra
            </TooltipContent>
          </Tooltip>
        </div>
      </TableCell>
    </TableRow>
  );
};

// ── Skeleton rows ────────────────────────────────────────────────────────────
const QuotationTableSkeleton: FC = () => (
  <>
    {Array.from({ length: 3 }).map((_, i) => (
      <TableRow key={i} className="border-b border-gray-100 hover:bg-transparent">
        <TableCell><Skeleton className="h-4 w-32 bg-gray-100" /></TableCell>
        <TableCell><Skeleton className="h-4 w-24 bg-gray-100" /></TableCell>
        <TableCell className="text-center">
          <Skeleton className="h-6 w-6 rounded-full mx-auto bg-gray-100" />
        </TableCell>
        <TableCell className="text-center">
          <Skeleton className="h-4 w-24 mx-auto bg-gray-100" />
        </TableCell>
        <TableCell className="text-center">
          <Skeleton className="h-6 w-20 rounded-full mx-auto bg-gray-100" />
        </TableCell>
        <TableCell className="text-center">
          <Skeleton className="h-4 w-6 mx-auto bg-gray-100" />
        </TableCell>
        <TableCell className="text-center">
          <Skeleton className="h-8 w-48 mx-auto bg-gray-100 rounded" />
        </TableCell>
      </TableRow>
    ))}
  </>
);
