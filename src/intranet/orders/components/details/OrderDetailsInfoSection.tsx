import type { FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Separator } from "@/shared/components/ui/separator";
import { CalendarDays, FileText, MapPin, Building2, Fingerprint, UserRound } from "lucide-react";
import type { GetOrderResponse } from "../../interfaces/responses.dto";
import { OrderStatesRecord } from "../../enum/order-state.record";

const statusStyles: Record<string, string> = {
  [OrderStatesRecord.approved]: "bg-green-100 text-green-700 border-green-300",
  [OrderStatesRecord.rejected]: "bg-red-100 text-red-700 border-red-300",
  [OrderStatesRecord.pending]: "bg-yellow-100 text-yellow-700 border-yellow-300",
};

const statusLabels: Record<string, string> = {
  [OrderStatesRecord.approved]: "Aceptado",
  [OrderStatesRecord.rejected]: "Rechazado",
  [OrderStatesRecord.pending]: "Pendiente",
};

export const OrderDetailsInfoSection: FC<{ order: GetOrderResponse }> = ({ order }) => {
  return (
    <Card className="border shadow-none">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <FileText className="h-5 w-5 text-muted-foreground" />
            Solicitud #{order.ID}
          </CardTitle>
          <Badge
            className={`rounded-full px-3 py-1 text-sm font-medium border self-start ${statusStyles[order.estado] || ""}`}
          >
            {statusLabels[order.estado] || order.estado}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5" />
              Cliente
            </span>
            <p className="text-sm font-medium text-foreground">{order.Cliente_Nombre}</p>
          </div>
          <div className="space-y-1.5">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <UserRound className="h-3.5 w-3.5" />
              Razón Social
            </span>
            <p className="text-sm text-muted-foreground">{order.Razon_Social}</p>
          </div>
          <div className="space-y-1.5">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Fingerprint className="h-3.5 w-3.5" />
              RUC / DNI
            </span>
            <p className="text-sm text-muted-foreground font-mono">{order.Id_Cliente}</p>
          </div>
          <div className="space-y-1.5">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" />
              Fecha de Creación
            </span>
            <p className="text-sm text-muted-foreground">
              {new Date(order.FechaCreacion).toLocaleDateString("es-PE", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        <Separator />

        <div className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5" />
            Descripción
          </span>
          <p className="text-sm text-foreground leading-relaxed">{order.descripcion}</p>
        </div>

        <div className="space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            Ubicación
          </span>
          <p className="text-sm text-muted-foreground">{order.ubicacion}</p>
        </div>
      </CardContent>
    </Card>
  );
};
