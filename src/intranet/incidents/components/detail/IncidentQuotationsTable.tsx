import { useState, type FC } from "react";
import { useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
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
  CalendarClock,
  FileCheck2,
  Loader2,
} from "lucide-react";
import { getIncidentQuotations } from "../../api/incident.api";
import type { IncidentQuotation } from "../../interfaces/incident-quotation";
import type { QuotationState } from "../../enum/quotation-state.record";
import { QuotationCommentsModal } from "./QuotationCommentsModal";
import { useSession } from "@/security/session/hooks/stores/useSession.store";
import { RolesRecord } from "@/security/session/enum/roles.enum";
import { canApprovePurchaseOrder } from "@/intranet/quotation/lib/can-approve-purchase-order";
import { hasPendingPurchaseOrderApproval } from "@/intranet/quotation/lib/can-approve-purchase-order";
import { QuotationEditPaymentTermsDialog } from "@/intranet/quotation/components/list/QuotationEditPaymentTermsDialog";
import { QuotationApproveOrderDialog } from "@/intranet/quotation/components/list/QuotationApproveOrderDialog";
import { useQuotationSummary } from "@/intranet/quotation/hooks/useQuotationSummary";
import type { Quotation } from "@/intranet/quotation/interfaces/quotation";
import { QuotationStatesRecord } from "@/intranet/quotation/enum/quotation-state.record";

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

const mapIncidentEstado = (estado: string): Quotation["estado"] => {
  const normalized = estado.toLowerCase();
  if (normalized.includes("aprobado") && !normalized.includes("no")) {
    return QuotationStatesRecord.approved;
  }
  if (normalized.includes("rechaz")) {
    return QuotationStatesRecord.rejected;
  }
  if (normalized.includes("pagad")) {
    return QuotationStatesRecord.incidentPaid;
  }
  if (normalized.includes("no aprob")) {
    return QuotationStatesRecord.notApproved;
  }
  return QuotationStatesRecord.pending;
};

const incidentQuotationFallback = (q: IncidentQuotation): Quotation => ({
  ID: q.id,
  nombre: q.nombre,
  precioTotal: String(q.precioTotal ?? q.precio_subtotal ?? 0),
  version: q.version,
  estado: mapIncidentEstado(String(q.estado)),
  condiciones: {
    fechaEmision: q.fecha_emision ?? "",
    fechaVigencia: "",
    condiciones: "",
    observaciones: "",
  },
  tasaCambio: { tasaCompra: 0, tasaVenta: 0 },
  esCotizacionIncidencia: true,
  cotizacion_de_incidencia: "YES",
  nombreCliente: q.nombreCliente ?? undefined,
});

interface IncidentQuotationsTableProps {
  incidentId: number;
  returnTo?: string;
}

export const IncidentQuotationsTable: FC<IncidentQuotationsTableProps> = ({
  incidentId,
  returnTo,
}) => {
  const role = useSession((state) => state.loggedUser?.rol);
  const canManagePayments = canApprovePurchaseOrder(role);

  const { data: quotations = [], isFetching } = useQuery({
    queryKey: ["incident-quotations", incidentId],
    queryFn: () => getIncidentQuotations(incidentId),
    enabled: incidentId > 0,
  });

  const [commentsOpen, setCommentsOpen] = useState<number | null>(null);
  const [paymentQuotationId, setPaymentQuotationId] = useState<number | null>(
    null,
  );
  const [approveQuotationId, setApproveQuotationId] = useState<number | null>(
    null,
  );

  const paymentSummary = useQuotationSummary(paymentQuotationId);
  const approveSummary = useQuotationSummary(approveQuotationId);

  const paymentQuotation =
    paymentSummary.data ??
    (paymentQuotationId != null
      ? quotations
          .filter((q) => q.id === paymentQuotationId)
          .map(incidentQuotationFallback)[0]
      : null);

  const approveQuotation =
    approveSummary.data ??
    (approveQuotationId != null
      ? quotations
          .filter((q) => q.id === approveQuotationId)
          .map(incidentQuotationFallback)[0]
      : null);

  return (
    <>
      {commentsOpen !== null && (
        <QuotationCommentsModal
          quotationId={commentsOpen}
          open
          onClose={() => setCommentsOpen(null)}
        />
      )}

      {paymentQuotation && (
        <QuotationEditPaymentTermsDialog
          quotation={paymentQuotation}
          open={paymentQuotationId !== null}
          onOpenChange={(open) => {
            if (!open) {
              setPaymentQuotationId(null);
            }
          }}
        />
      )}

      {approveQuotation && (
        <QuotationApproveOrderDialog
          quotation={approveQuotation}
          open={approveQuotationId !== null}
          onOpenChange={(open) => {
            if (!open) {
              setApproveQuotationId(null);
            }
          }}
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
                <IncidentQuotationRow
                  key={q.id}
                  quotation={q}
                  returnTo={returnTo}
                  canManagePayments={canManagePayments}
                  onOpenComments={() => setCommentsOpen(q.id)}
                  onOpenPayments={() => setPaymentQuotationId(q.id)}
                  onReviewPurchaseOrder={() => setApproveQuotationId(q.id)}
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

const IncidentQuotationRow: FC<{
  quotation: IncidentQuotation;
  returnTo?: string;
  canManagePayments: boolean;
  onOpenComments: () => void;
  onOpenPayments: () => void;
  onReviewPurchaseOrder: () => void;
}> = ({
  quotation,
  returnTo,
  canManagePayments,
  onOpenComments,
  onOpenPayments,
  onReviewPurchaseOrder,
}) => {
  const navigate = useNavigate();
  const role = useSession((state) => state.loggedUser?.rol);
  const summaryQuery = useQuotationSummary(quotation.id, canManagePayments);
  const summary = summaryQuery.data ?? incidentQuotationFallback(quotation);

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

  const showReviewPo =
    canApprovePurchaseOrder(role) &&
    hasPendingPurchaseOrderApproval(summary);

  const openEditor = () =>
    navigate(`/intranet/cotizaciones/editar/${quotation.id}`, {
      state: returnTo ? { returnTo } : undefined,
    });

  const openViewer = () =>
    navigate(`/intranet/cotizaciones/detalles/${quotation.id}`, {
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
          {canManagePayments && (
            <>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-teal-600 hover:text-teal-700 hover:bg-teal-50"
                    onClick={onOpenPayments}
                    disabled={summaryQuery.isLoading}
                  >
                    {summaryQuery.isLoading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <CalendarClock className="w-3.5 h-3.5" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                  Plazos y pagos
                </TooltipContent>
              </Tooltip>

              {showReviewPo && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-violet-600 hover:text-violet-700 hover:bg-violet-50"
                      onClick={onReviewPurchaseOrder}
                    >
                      <FileCheck2 className="w-3.5 h-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs">
                    Revisar orden de compra
                  </TooltipContent>
                </Tooltip>
              )}
            </>
          )}

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
                aria-label="Ver cotización"
                onClick={openViewer}
              >
                <Eye className="w-3.5 h-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="text-xs">
              Ver cotización
            </TooltipContent>
          </Tooltip>

          {(role === RolesRecord.projectAdmin ||
            role === RolesRecord.manager ||
            role === RolesRecord.lawyer) && (
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
          )}

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
