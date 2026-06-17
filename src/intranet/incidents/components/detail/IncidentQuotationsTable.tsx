import { useState, type FC } from "react";
import { useNavigate } from "react-router";
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
import { Eye, MessageCircle, Pencil } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getIncidentQuotations } from "../../api/incident.api";
import type { IncidentQuotation } from "../../interfaces/incident-quotation";
import type { QuotationState } from "../../enum/quotation-state.record";
import { QuotationCommentsModal } from "./QuotationCommentsModal";

const quotationStatusStyles = new Map<QuotationState, string>([
  ["Pendiente", "bg-gray-100 text-gray-600 border-gray-300"],
  ["Enviado", "bg-blue-100 text-blue-700 border-blue-300"],
  ["Aprobado", "bg-green-100 text-green-700 border-green-300"],
  ["Rechazado", "bg-red-100 text-red-700 border-red-300"],
  ["Disputado", "bg-orange-100 text-orange-700 border-orange-300"],
  ["Pago realizado", "bg-violet-100 text-violet-700 border-violet-300"],
]);

const formatMoney = (value: number | string | null | undefined) => {
  if (value == null || value === "") return "—";
  const amount = Number(value);
  if (!Number.isFinite(amount)) return "—";
  return `S/ ${amount.toLocaleString("es-PE", { minimumFractionDigits: 2 })}`;
};

const formatDate = (value: string | null | undefined) => {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("es-PE", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};

interface IncidentQuotationsTableProps {
  incidentId: number;
  returnTo?: string;
}

export const IncidentQuotationsTable: FC<IncidentQuotationsTableProps> = ({
  incidentId,
  returnTo,
}) => {
  const { data: quotations = [], isFetching } = useQuery({
    queryKey: ["incident-quotations", incidentId],
    queryFn: () => getIncidentQuotations(incidentId),
    enabled: incidentId > 0,
  });

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
          <TableHeader className="[&_tr]:border-b border-gray-200">
            <TableRow className="hover:bg-transparent bg-muted/30">
              <TableHead className="text-gray-500 font-medium text-xs uppercase tracking-wide">
                ID
              </TableHead>
              <TableHead className="text-gray-500 font-medium text-xs uppercase tracking-wide">
                Nombre
              </TableHead>
              <TableHead className="text-center text-gray-500 font-medium text-xs uppercase tracking-wide">
                Versión
              </TableHead>
              <TableHead className="text-center text-gray-500 font-medium text-xs uppercase tracking-wide">
                Desactualizado
              </TableHead>
              <TableHead className="text-center text-gray-500 font-medium text-xs uppercase tracking-wide">
                Estado
              </TableHead>
              <TableHead className="text-center text-gray-500 font-medium text-xs uppercase tracking-wide">
                Precio total
              </TableHead>
              <TableHead className="text-gray-500 font-medium text-xs uppercase tracking-wide">
                Destinatario
              </TableHead>
              <TableHead className="text-center text-gray-500 font-medium text-xs uppercase tracking-wide">
                Fecha emisión
              </TableHead>
              <TableHead className="text-center text-gray-500 font-medium text-xs uppercase tracking-wide">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isFetching ? (
              <QuotationTableSkeleton />
            ) : quotations.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={9}
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
                  returnTo={returnTo}
                  onOpenComments={() => setCommentsOpen(q.id)}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {quotations.length > 0 && (
        <p className="text-xs text-muted-foreground text-right mt-1">
          {quotations.length} cotización{quotations.length !== 1 ? "es" : ""} —
          incluye versiones desactualizadas
        </p>
      )}
    </>
  );
};

const QuotationTableRow: FC<{
  quotation: IncidentQuotation;
  returnTo?: string;
  onOpenComments: () => void;
}> = ({ quotation, returnTo, onOpenComments }) => {
  const navigate = useNavigate();
  const badgeClass =
    quotationStatusStyles.get(quotation.estado as QuotationState) ??
    "bg-gray-100 text-gray-600 border-gray-300";
  const isOutdated =
    quotation.desactualizado?.toUpperCase() === "YES" ||
    quotation.desactualizado?.toUpperCase() === "SI";
  const destinatario =
    quotation.nombreCliente ?? quotation.destinatario ?? "—";
  const emissionDate = quotation.fecha_emision ?? quotation.fecha_envio;
  const price = quotation.precioTotal ?? quotation.precio_subtotal;

  const openEditor = () =>
    navigate(`/intranet/cotizaciones/editar/${quotation.id}`, {
      state: returnTo ? { returnTo } : undefined,
    });

  return (
    <TableRow className="border-b border-gray-100 hover:bg-gray-50/70 transition-colors">
      <TableCell className="font-mono text-sm text-gray-700">
        {quotation.id}
      </TableCell>
      <TableCell className="font-medium text-gray-800 font-mono text-sm">
        {quotation.nombre}
      </TableCell>
      <TableCell className="text-center">
        <span className="inline-flex items-center justify-center h-6 min-w-[1.5rem] px-1.5 rounded-full bg-muted text-xs font-semibold text-muted-foreground border border-border">
          v{quotation.version}
        </span>
      </TableCell>
      <TableCell className="text-center">
        <span
          className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold border ${
            isOutdated
              ? "bg-amber-100 text-amber-700 border-amber-300"
              : "bg-green-50 text-green-700 border-green-300"
          }`}
        >
          {isOutdated ? "Sí" : "No"}
        </span>
      </TableCell>
      <TableCell className="text-center">
        <span
          className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold border ${badgeClass}`}
        >
          {quotation.estado}
        </span>
      </TableCell>
      <TableCell className="text-center text-gray-700 font-mono text-sm">
        {formatMoney(price)}
      </TableCell>
      <TableCell className="text-sm text-gray-700">{destinatario}</TableCell>
      <TableCell className="text-center text-sm text-gray-600">
        {formatDate(emissionDate)}
      </TableCell>
      <TableCell className="text-center">
        <div className="flex items-center justify-center gap-0.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
                aria-label="Ver cotización"
                onClick={openEditor}
              >
                <Eye className="w-3.5 h-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs">
              Abrir editor de cotización
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-blue-500 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                aria-label="Editar cotización"
                onClick={openEditor}
              >
                <Pencil className="w-3.5 h-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs">
              Editar cotización
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                aria-label="Ver comentarios"
                onClick={onOpenComments}
              >
                <MessageCircle className="w-3.5 h-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs">
              Ver comentarios
            </TooltipContent>
          </Tooltip>
        </div>
      </TableCell>
    </TableRow>
  );
};

const QuotationTableSkeleton: FC = () => (
  <>
    {Array.from({ length: 3 }).map((_, i) => (
      <TableRow key={i} className="border-b border-gray-100 hover:bg-transparent">
        {Array.from({ length: 9 }).map((__, j) => (
          <TableCell key={j}>
            <Skeleton className="h-4 w-full max-w-[6rem] bg-gray-100" />
          </TableCell>
        ))}
      </TableRow>
    ))}
  </>
);
