import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getOrder } from "../api/order.api";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  ArrowLeft,
  MapPin,
  FileText,
  User,
  CalendarDays,
  ClipboardList,
  Loader2,
} from "lucide-react";
import { OrderStatesRecord } from "../enum/order-state.record";
import { useSession } from "@/security/session/hooks/stores/useSession.store";
import { RolesRecord } from "@/security/session/enum/roles.enum";

const statusStyles: Record<string, string> = {
  [OrderStatesRecord.approved]: "bg-green-100 text-green-700 border-green-400",
  [OrderStatesRecord.rejected]: "bg-red-100 text-red-700 border-red-400",
  [OrderStatesRecord.pending]: "bg-yellow-100 text-yellow-700 border-yellow-400",
};

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useSession((s) => s.loggedUser);

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["order", id],
    queryFn: () => getOrder(Number(id)),
    enabled: !!id,
  });

  if (isPending) {
    return (
      <div className="flex flex-1 items-center justify-center py-20">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center py-20 gap-4">
        <p className="text-red-500 text-sm">{error?.message ?? "Error al cargar la solicitud."}</p>
        <Button variant="secondary" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 w-4 h-4" /> Volver
        </Button>
      </div>
    );
  }

  const order = data;
  const estadoStyle = statusStyles[order.estado] ?? "bg-gray-100 text-gray-700 border-gray-400";
  const isAdmin = user?.rol === RolesRecord.projectAdmin || user?.rol === RolesRecord.manager;

  return (
    <>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="shrink-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="h-7 w-1 rounded-full bg-primary" />
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Detalle de Solicitud #{order.ID}
        </h1>
        <Badge className={`ml-auto rounded-full px-3 py-1 border text-sm font-medium ${estadoStyle}`}>
          {order.estado.charAt(0).toUpperCase() + order.estado.slice(1)}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Información general */}
        <div className="bg-card border rounded-xl p-6 space-y-4 shadow-xs">
          <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-primary" />
            Información General
          </h2>

          {isAdmin && (
            <div className="flex items-start gap-3">
              <User className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Cliente</p>
                <p className="text-sm font-medium text-foreground">{order.Cliente_Nombre}</p>
                {order.Razon_Social && (
                  <p className="text-xs text-muted-foreground">{order.Razon_Social}</p>
                )}
              </div>
            </div>
          )}

          <div className="flex items-start gap-3">
            <FileText className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Descripción</p>
              <p className="text-sm text-foreground">{order.descripcion || "Sin descripción"}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Ubicación</p>
              <p className="text-sm text-foreground">{order.ubicacion || "Sin ubicación"}</p>
            </div>
          </div>

          {order.FechaCreacion && (
            <div className="flex items-start gap-3">
              <CalendarDays className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Fecha de creación</p>
                <p className="text-sm text-foreground">
                  {new Date(order.FechaCreacion).toLocaleDateString("es-ES", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Observaciones */}
        <div className="bg-card border rounded-xl p-6 space-y-4 shadow-xs">
          <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary" />
            Observaciones
          </h2>

          <div>
            <p className="text-xs text-muted-foreground mb-1">Observaciones generales</p>
            <p className="text-sm text-foreground bg-muted rounded-lg p-3 min-h-[60px]">
              {order.ObsGenerales || "Sin observaciones generales."}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-1">Observaciones de elección</p>
            <p className="text-sm text-foreground bg-muted rounded-lg p-3 min-h-[60px]">
              {order.ObsEleccion || "Sin observaciones de elección."}
            </p>
          </div>

          {order.Respuesta && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Respuesta / Motivo de rechazo</p>
              <p className="text-sm text-foreground bg-red-50 border border-red-200 rounded-lg p-3 min-h-[60px]">
                {order.Respuesta}
              </p>
            </div>
          )}
        </div>

        {/* Servicios */}
        {order.servicios && order.servicios.length > 0 && (
          <div className="bg-card border rounded-xl p-6 shadow-xs lg:col-span-2">
            <h2 className="text-base font-semibold text-foreground flex items-center gap-2 mb-4">
              <ClipboardList className="w-4 h-4 text-primary" />
              Servicios solicitados
            </h2>
            <div className="divide-y divide-border">
              {order.servicios.map((s) => (
                <div key={s.id} className="py-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                  <div>
                    <span className="text-xs text-muted-foreground block">ID Servicio</span>
                    <span className="font-medium">#{s.ID_Servicio}</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">Inicio</span>
                    <span>{s.fecha_inicio_servicio ?? "—"}</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">Horario</span>
                    <span>{s.horario_servicio ?? "—"}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Inventario */}
        {order.inventario && order.inventario.length > 0 && (
          <div className="bg-card border rounded-xl p-6 shadow-xs lg:col-span-2">
            <h2 className="text-base font-semibold text-foreground flex items-center gap-2 mb-4">
              <ClipboardList className="w-4 h-4 text-primary" />
              Inventario solicitado
            </h2>
            <div className="divide-y divide-border">
              {order.inventario.map((item, i) => (
                <div key={i} className="py-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                  <div>
                    <span className="text-xs text-muted-foreground block">Producto</span>
                    <span className="font-medium">{(item as any).Objeto_Nombre ?? `#${(item as any).ID_Inventario}`}</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">Cantidad</span>
                    <span>{(item as any).cantidad ?? "—"}</span>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground block">Intención</span>
                    <span>{(item as any).intencion ?? "—"}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default OrderDetailPage;
