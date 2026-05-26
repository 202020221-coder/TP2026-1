import type { FC } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { MessageSquare, Truck, Package, ClipboardList } from "lucide-react";
import type { DetailedOrder } from "../../interfaces/order";

export const OrderDetailsObservationsSection: FC<{ order: DetailedOrder }> = ({
  order,
}) => {
  const hasObservations =
    order.ProductoEnvio ||
    order.CamionesEnvio ||
    order.ObsGenerales ||
    order.ObsEleccion ||
    order.Respuesta;

  if (!hasObservations) return null;

  return (
    <Card className="border shadow-none">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <ClipboardList className="h-4 w-4 text-muted-foreground" />
          Observaciones y Detalles
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {order.ProductoEnvio && (
            <div className="space-y-1.5 p-3 rounded-lg bg-muted/40">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Package className="h-3 w-3" />
                Producto de Envío
              </span>
              <p className="text-sm">{order.ProductoEnvio}</p>
            </div>
          )}
          {order.CamionesEnvio && (
            <div className="space-y-1.5 p-3 rounded-lg bg-muted/40">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Truck className="h-3 w-3" />
                Camiones de Envío
              </span>
              <p className="text-sm">{order.CamionesEnvio}</p>
            </div>
          )}
          {order.ObsGenerales && (
            <div className="space-y-1.5 p-3 rounded-lg bg-muted/40">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                Observaciones Generales
              </span>
              <p className="text-sm">{order.ObsGenerales}</p>
            </div>
          )}
          {order.ObsEleccion && (
            <div className="space-y-1.5 p-3 rounded-lg bg-muted/40">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                Observaciones de Elección
              </span>
              <p className="text-sm">{order.ObsEleccion}</p>
            </div>
          )}
          {order.Respuesta && (
            <div className="space-y-1.5 p-3 rounded-lg bg-red-50/80 col-span-full">
              <span className="text-xs font-medium text-red-600 uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare className="h-3 w-3" />
                Respuesta / Mensaje de Declinación
              </span>
              <p className="text-sm text-red-700">{order.Respuesta}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
