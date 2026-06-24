import { Link } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
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
import { ArrowRight, FileText, MessageSquare, Plus } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { formatCurrency } from "@/shared/lib/format-currency";
import type {
  ClientQuotationSummary,
  ClientRecentMessage,
  ClientRequestSummary,
} from "../interfaces/client-dashboard.types";

const TONE_STYLES = {
  success: "border-emerald-300 bg-emerald-50 text-emerald-700",
  warning: "border-amber-300 bg-amber-50 text-amber-700",
  neutral: "border-sky-300 bg-sky-50 text-sky-700",
  danger: "border-red-300 bg-red-50 text-red-700",
} as const;

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

export function ClientMessagesAndRequestsPanel({
  messages,
  requests,
}: {
  messages: ClientRecentMessage[];
  requests: ClientRequestSummary[];
}) {
  return (
    <div className="space-y-5">
      <Card className="border-0 bg-white/90 shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <CardTitle className="text-base">Mensajes recientes</CardTitle>
              <CardDescription className="text-xs">
                Comunicación con el equipo SWEFIRE
              </CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm" className="text-xs">
              <Link to="/intranet/cotizaciones/">Ver todos</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {messages.length === 0 ? (
            <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50/70 px-4 py-6 text-center text-sm text-muted-foreground">
              No hay mensajes recientes.
            </p>
          ) : (
            messages.map((item) => (
              <Link
                key={item.id}
                to={`/intranet/cotizaciones/detalles/${item.quotationId}`}
                className="block rounded-xl border border-slate-200/80 p-3 transition-colors hover:border-primary/30 hover:bg-primary/5"
              >
                <div className="mb-1 flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-semibold text-slate-800">
                    {item.quotationName}
                  </span>
                  {item.needsClientReply ? (
                    <Badge
                      variant="outline"
                      className="shrink-0 border-amber-300 bg-amber-50 text-[10px] text-amber-700"
                    >
                      Tu respuesta
                    </Badge>
                  ) : null}
                </div>
                <p className="line-clamp-2 text-xs text-slate-600">
                  {item.preview}
                </p>
                <p className="mt-1 text-[11px] text-slate-400">{item.timeAgo}</p>
              </Link>
            ))
          )}
        </CardContent>
      </Card>

      <Card className="border-0 bg-white/90 shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <CardTitle className="text-base">Mis solicitudes</CardTitle>
              <CardDescription className="text-xs">
                Requerimientos y tickets abiertos
              </CardDescription>
            </div>
            <Button asChild size="sm" className="h-8 text-xs">
              <Link to="/intranet/solicitudes/crear">
                <Plus className="mr-1 size-3.5" />
                Nueva
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50/70 px-4 py-6 text-center text-sm text-muted-foreground">
              No tienes solicitudes registradas.
            </p>
          ) : (
            <div className="overflow-hidden rounded-xl border border-slate-200/80">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/80 hover:bg-slate-50/80">
                    <TableHead className="text-xs">ID</TableHead>
                    <TableHead className="text-xs">Descripción</TableHead>
                    <TableHead className="text-xs">Fecha</TableHead>
                    <TableHead className="text-xs">Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="font-mono text-xs">
                        SOL-{String(row.id).padStart(4, "0")}
                      </TableCell>
                      <TableCell className="max-w-[140px] truncate text-sm">
                        {row.description}
                      </TableCell>
                      <TableCell className="text-xs text-slate-500">
                        {formatDate(row.date)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn("text-[10px]", TONE_STYLES[row.statusTone])}
                        >
                          {row.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          <Button asChild variant="outline" className="mt-3 w-full" size="sm">
            <Link to="/intranet/solicitudes/">
              Ver todas las solicitudes
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export function ClientQuotationsPanel({
  quotations,
  showApproveCta,
  approveQuotationId,
}: {
  quotations: ClientQuotationSummary[];
  showApproveCta: boolean;
  approveQuotationId: number | null;
}) {
  return (
    <Card className="h-full border-0 bg-white/90 shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-2.5">
          <div className="rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 p-2 shadow-lg">
            <FileText className="size-4 text-white" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-base">Cotizaciones y documentos</CardTitle>
            <CardDescription className="text-xs">
              Historial y acciones pendientes de tu parte
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {showApproveCta && approveQuotationId ? (
          <Button
            asChild
            className="h-10 w-full bg-primary text-sm font-semibold shadow-md hover:bg-primary/90"
          >
            <Link to={`/intranet/cotizaciones/detalles/${approveQuotationId}`}>
              Revisar y Aprobar Cotización
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        ) : null}

        {quotations.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50/70 px-4 py-8 text-center text-sm text-muted-foreground">
            Aún no tienes cotizaciones registradas.
          </p>
        ) : (
          quotations.map((item) => (
            <Link
              key={item.id}
              to={`/intranet/cotizaciones/detalles/${item.id}`}
              className="flex items-center justify-between gap-3 rounded-xl border border-slate-200/80 p-3 transition-colors hover:border-primary/30 hover:bg-primary/5"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-800">
                  {item.name}
                </p>
                <p className="font-mono text-xs font-medium text-slate-600">
                  {formatCurrency(item.amount, "PEN", 0)}
                </p>
              </div>
              <Badge
                variant="outline"
                className={cn("shrink-0 text-[10px]", TONE_STYLES[item.statusTone])}
              >
                {item.status}
              </Badge>
            </Link>
          ))
        )}

        <Button asChild variant="outline" className="w-full" size="sm">
          <Link to="/intranet/cotizaciones/">
            <MessageSquare className="mr-2 size-4" />
            Ir a cotizaciones
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
