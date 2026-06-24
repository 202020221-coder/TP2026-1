import { Link } from "react-router";
import { MessageSquare, MessagesSquare } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { cn } from "@/shared/lib/utils";
import type { InteractionFeedItem } from "../interfaces/project-assistant-dashboard.types";

const URGENCY_STYLES = {
  alta: "border-red-300 bg-red-50 text-red-700",
  media: "border-amber-300 bg-amber-50 text-amber-700",
  baja: "border-slate-300 bg-slate-50 text-slate-600",
} as const;

const URGENCY_LABELS = {
  alta: "Alta",
  media: "Media",
  baja: "Baja",
} as const;

interface InteractionFeedPanelProps {
  items: InteractionFeedItem[];
}

export function InteractionFeedPanel({ items }: InteractionFeedPanelProps) {
  return (
    <Card className="h-full border-0 bg-white/90 shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-2.5">
          <div className="rounded-xl bg-gradient-to-br from-rose-500 to-red-600 p-2 shadow-lg">
            <MessagesSquare className="size-4 text-white" />
          </div>
          <div>
            <CardTitle className="text-base">
              Bandeja de Interacción
            </CardTitle>
            <CardDescription className="text-xs">
              Mensajes y consultas pendientes en solicitudes y cotizaciones.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/70 px-4 py-8 text-center text-sm text-muted-foreground">
            No hay mensajes pendientes por atender.
          </div>
        ) : (
          items.map((item) => (
            <Link
              key={item.id}
              to={`/intranet/cotizaciones/detalles/${item.quotationId}`}
              className="block rounded-xl border border-slate-200/80 bg-slate-50/50 p-3 transition-colors hover:border-primary/30 hover:bg-primary/5"
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-800">
                    {item.clientName}
                  </p>
                  <p className="truncate text-[11px] text-slate-500">
                    {item.documentLabel}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    "shrink-0 text-[10px] font-semibold",
                    URGENCY_STYLES[item.urgency],
                  )}
                >
                  {URGENCY_LABELS[item.urgency]}
                </Badge>
              </div>
              <p className="line-clamp-2 text-xs leading-relaxed text-slate-600">
                {item.messagePreview}
              </p>
              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                <span className="inline-flex items-center gap-1">
                  <MessageSquare className="size-3" />
                  {item.timeAgo}
                </span>
                <span className="font-medium text-primary">Responder</span>
              </div>
            </Link>
          ))
        )}

        <Button asChild variant="outline" className="mt-2 w-full">
          <Link to="/intranet/cotizaciones/">
            Ir a Mensajería Centralizada
            <MessagesSquare className="ml-2 size-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
