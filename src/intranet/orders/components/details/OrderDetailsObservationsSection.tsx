import type { FC } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/shared/components/ui/collapsible";
import {
  ChevronDown,
  MapPin,
  MessageSquare,
  Wrench,
  Package,
  ClipboardList,
} from "lucide-react";
import type { DetailedOrder } from "../../interfaces/order";

interface SelectedServiceDetail {
  name: string;
  direccionLugar?: string;
  observacionesEleccion?: string;
}

const SERVICE_DETAILS_SEPARATOR = /\n---\n/g;

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function parseSelectedServiceDetails(
  servicesText?: string,
  detailsText?: string,
) {
  const serviceNames =
    servicesText
      ?.split(",")
      .map((service) => service.trim())
      .filter(Boolean) ?? [];

  const blocks =
    detailsText
      ?.split(SERVICE_DETAILS_SEPARATOR)
      .map((block) => block.trim())
      .filter(Boolean) ?? [];

  const parsedBlocks = blocks.reduce<{
    services: SelectedServiceDetail[];
    standaloneObservation: string;
  }>(
    (acc, block) => {
      const lines = block
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
      const serviceLine = lines.find((line) => /^Servicio\s+\d+:/i.test(line));

      if (!serviceLine) {
        acc.standaloneObservation = acc.standaloneObservation
          ? `${acc.standaloneObservation}\n${block}`
          : block;
        return acc;
      }

      const detail: SelectedServiceDetail = {
        name: serviceLine.replace(/^Servicio\s+\d+:\s*/i, "").trim(),
      };

      for (const line of lines) {
        if (/^Dirección del lugar:/i.test(line)) {
          detail.direccionLugar = line.replace(/^Dirección del lugar:\s*/i, "").trim();
        }
        if (/^Observaciones de su elección:/i.test(line)) {
          detail.observacionesEleccion = line
            .replace(/^Observaciones de su elección:\s*/i, "")
            .trim();
        }
      }

      acc.services.push(detail);
      return acc;
    },
    { services: [], standaloneObservation: "" },
  );

  if (parsedBlocks.services.length > 0) {
    return {
      services: parsedBlocks.services,
      standaloneObservation: parsedBlocks.standaloneObservation,
    };
  }

  const legacyObservations =
    detailsText
      ?.split("|")
      .map((item) => item.trim())
      .filter(Boolean) ?? [];

  const services = serviceNames.map<SelectedServiceDetail>((name) => {
    const observation = legacyObservations.find((item) =>
      item.toLowerCase().startsWith(`${name.toLowerCase()}:`),
    );

    return {
      name,
      observacionesEleccion: observation
        ? observation.replace(new RegExp(`^${escapeRegExp(name)}:\\s*`, "i"), "").trim()
        : undefined,
    };
  });

  return {
    services,
    standaloneObservation: services.length === 0 ? detailsText ?? "" : "",
  };
}

export const OrderDetailsObservationsSection: FC<{ order: DetailedOrder }> = ({
  order,
}) => {
  const { services, standaloneObservation } = parseSelectedServiceDetails(
    order.CamionesEnvio,
    order.ObsEleccion,
  );
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
            <div className="space-y-3 p-3 rounded-lg bg-muted/40">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Wrench className="h-3 w-3" />
                Servicios seleccionados
              </span>
              {services.length > 0 ? (
                <div className="space-y-2">
                  {services.map((service, index) => (
                    <Collapsible
                      key={`${service.name}-${index}`}
                      className="rounded-md border border-border/60 bg-background"
                    >
                      <CollapsibleTrigger className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-medium text-foreground transition-colors hover:bg-muted/50">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
                          {index + 1}
                        </span>
                        <span className="min-w-0 flex-1 truncate">{service.name}</span>
                        <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="border-t border-border/60 px-3 py-2">
                        <div className="space-y-2 text-xs">
                          <div>
                            <span className="mb-1 flex items-center gap-1.5 font-medium text-muted-foreground uppercase tracking-wider">
                              <MapPin className="h-3 w-3" />
                              Dirección del lugar
                            </span>
                            <p className="text-sm text-foreground">
                              {service.direccionLugar || "No registrada"}
                            </p>
                          </div>
                          <div>
                            <span className="font-medium text-muted-foreground uppercase tracking-wider">
                              Observaciones de su elección
                            </span>
                            <p className="mt-1 text-sm text-foreground">
                              {service.observacionesEleccion || "No registradas"}
                            </p>
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </div>
              ) : (
                <p className="text-sm">{order.CamionesEnvio}</p>
              )}
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
          {(standaloneObservation || (!order.CamionesEnvio && order.ObsEleccion)) && (
            <div className="space-y-1.5 p-3 rounded-lg bg-muted/40">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                Observaciones de Elección
              </span>
              <p className="text-sm whitespace-pre-line">
                {standaloneObservation || order.ObsEleccion}
              </p>
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
