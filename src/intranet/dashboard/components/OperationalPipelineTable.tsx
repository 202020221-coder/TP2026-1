import { useState } from "react";
import { Link } from "react-router";
import { ArrowRight, Link2 } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { cn } from "@/shared/lib/utils";
import { QuotationApproveOrderDialog } from "@/intranet/quotation/components/list/QuotationApproveOrderDialog";
import { formatCurrency } from "@/shared/lib/format-currency";
import type { Quotation } from "@/intranet/quotation/interfaces/quotation";
import type {
  OperationalPipelineRow,
  OperationalPipelineStatus,
} from "../interfaces/project-assistant-dashboard.types";

const STATUS_STYLES: Record<OperationalPipelineStatus, string> = {
  Pendiente: "border-amber-300 bg-amber-50 text-amber-700",
  Cotizado: "border-sky-300 bg-sky-50 text-sky-700",
  Aprobado: "border-emerald-300 bg-emerald-50 text-emerald-700",
  "En Ejecución": "border-violet-300 bg-violet-50 text-violet-700",
};

function formatDate(dateStr: string) {
  if (!dateStr) return "—";
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function resolveRequestId(row: OperationalPipelineRow) {
  if (row.orderId) return `SOL-${String(row.orderId).padStart(4, "0")}`;
  if (row.quotationId) return `COT-${String(row.quotationId).padStart(4, "0")}`;
  return "—";
}

interface OperationalPipelineTableProps {
  rows: OperationalPipelineRow[];
  quotations: Quotation[];
}

export function OperationalPipelineTable({
  rows,
  quotations,
}: OperationalPipelineTableProps) {
  const [approveTarget, setApproveTarget] = useState<Quotation | null>(null);

  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-6 py-10 text-center text-sm text-muted-foreground">
        No hay requerimientos que coincidan con los filtros seleccionados.
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-slate-200/80">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/80 hover:bg-slate-50/80">
              <TableHead className="text-xs font-semibold uppercase tracking-wide">
                ID Solicitud
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wide">
                Cliente
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wide">
                Servicio
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wide">
                Ingreso
              </TableHead>
              <TableHead className="text-right text-xs font-semibold uppercase tracking-wide">
                Monto
              </TableHead>
              <TableHead className="text-xs font-semibold uppercase tracking-wide">
                Estado
              </TableHead>
              <TableHead className="text-right text-xs font-semibold uppercase tracking-wide">
                Acción
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => {
              const quotation = quotations.find((q) => q.ID === row.quotationId);

              return (
                <TableRow key={row.key} className="hover:bg-slate-50/50">
                  <TableCell className="font-mono text-xs font-medium text-slate-700">
                    {resolveRequestId(row)}
                  </TableCell>
                  <TableCell className="max-w-[140px] truncate text-sm">
                    {row.clientName}
                  </TableCell>
                  <TableCell className="max-w-[180px] truncate text-sm text-slate-600">
                    {row.serviceName}
                  </TableCell>
                  <TableCell className="text-sm text-slate-500">
                    {formatDate(row.entryDate)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm font-semibold text-slate-700">
                    {row.amount != null
                      ? formatCurrency(row.amount, "PEN", 0)
                      : "—"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn("text-[11px] font-medium", STATUS_STYLES[row.status])}
                    >
                      {row.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {row.status === "Pendiente" && row.orderId ? (
                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="h-8 text-xs"
                      >
                        <Link to={`/intranet/cotizaciones/crear?orderId=${row.orderId}`}>
                          Cotizar
                          <ArrowRight className="ml-1 size-3.5" />
                        </Link>
                      </Button>
                    ) : null}

                    {row.canLinkProject && quotation ? (
                      <Button
                        size="sm"
                        className="h-8 bg-primary text-xs hover:bg-primary/90"
                        onClick={() => setApproveTarget(quotation)}
                      >
                        <Link2 className="mr-1 size-3.5" />
                        Vincular a Proyecto
                      </Button>
                    ) : null}

                    {row.status === "En Ejecución" && row.projectId ? (
                      <Button
                        asChild
                        size="sm"
                        variant="ghost"
                        className="h-8 text-xs"
                      >
                        <Link to={`/intranet/proyectos/`}>
                          Ver proyecto
                          <ArrowRight className="ml-1 size-3.5" />
                        </Link>
                      </Button>
                    ) : null}

                    {row.status === "Cotizado" && row.quotationId ? (
                      <Button
                        asChild
                        size="sm"
                        variant="ghost"
                        className="h-8 text-xs"
                      >
                        <Link to={`/intranet/cotizaciones/detalles/${row.quotationId}`}>
                          Detalle
                          <ArrowRight className="ml-1 size-3.5" />
                        </Link>
                      </Button>
                    ) : null}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {approveTarget ? (
        <QuotationApproveOrderDialog
          quotation={approveTarget}
          open={Boolean(approveTarget)}
          onOpenChange={(open) => {
            if (!open) setApproveTarget(null);
          }}
        />
      ) : null}
    </>
  );
}
