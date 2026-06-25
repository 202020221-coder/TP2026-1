import type { FC } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Wrench } from "lucide-react";
import type { GetOrderResponseDTO } from "../../interfaces/responses.dto";
import {
  extractServiceNameFromDescription,
  normalizeOrderServices,
  type OrderDetailWithServices,
} from "../../lib/order-service.utils";

const formatServiceDate = (value?: string | null): string => {
  if (!value?.trim()) return "—";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("es-PE", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const OrderDetailsServicesSection: FC<{
  order: GetOrderResponseDTO;
}> = ({ order }) => {
  const { allServices, principal } = normalizeOrderServices(
    order as OrderDetailWithServices,
  );

  const principalNameFromDescription = extractServiceNameFromDescription(
    order.descripcion,
  );

  const displayServices =
    allServices.length > 0
      ? allServices
      : principalNameFromDescription
        ? [
            {
              rowId: null,
              ID_Servicio: 0,
              nombre: principalNameFromDescription,
              Principal: true,
              fecha_inicio_servicio: "",
              fecha_fin_servicio: "",
              horario_servicio: "",
              id_subservicio: null,
              ubicacion_etapa: null,
            },
          ]
        : [];

  if (displayServices.length === 0) return null;

  return (
    <Card className="border shadow-none">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Wrench className="h-4 w-4 text-muted-foreground" />
          Servicios Solicitados
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3 font-medium text-muted-foreground">
                  Servicio
                </th>
                <th className="text-left py-2 px-3 font-medium text-muted-foreground">
                  Rol
                </th>
                <th className="text-left py-2 px-3 font-medium text-muted-foreground">
                  Etapa
                </th>
                <th className="text-left py-2 px-3 font-medium text-muted-foreground">
                  Inicio
                </th>
                <th className="text-left py-2 px-3 font-medium text-muted-foreground">
                  Fin
                </th>
                <th className="text-left py-2 px-3 font-medium text-muted-foreground">
                  Horario
                </th>
              </tr>
            </thead>
            <tbody>
              {displayServices.map((servicio, index) => {
                const isPrincipal =
                  servicio.Principal ||
                  (principal != null &&
                    servicio.ID_Servicio === principal.ID_Servicio);

                return (
                  <tr
                    key={servicio.rowId ?? `${servicio.ID_Servicio}-${index}`}
                    className="border-b border-border/50 last:border-0"
                  >
                    <td className="py-2.5 px-3 font-medium">
                      <div className="flex flex-col gap-1">
                        <span>
                          {servicio.nombre ??
                            (servicio.ID_Servicio > 0
                              ? `Servicio #${servicio.ID_Servicio}`
                              : principalNameFromDescription)}
                        </span>
                        {servicio.ID_Servicio > 0 && (
                          <span className="text-xs text-muted-foreground">
                            ID {servicio.ID_Servicio}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      {isPrincipal ? (
                        <Badge variant="secondary" className="text-[10px]">
                          Principal
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10px]">
                          Secundario
                        </Badge>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-muted-foreground">
                      {servicio.ubicacion_etapa?.nombre ?? "—"}
                    </td>
                    <td className="py-2.5 px-3 text-muted-foreground">
                      {formatServiceDate(servicio.fecha_inicio_servicio)}
                    </td>
                    <td className="py-2.5 px-3 text-muted-foreground">
                      {formatServiceDate(servicio.fecha_fin_servicio)}
                    </td>
                    <td className="py-2.5 px-3 text-muted-foreground">
                      {servicio.horario_servicio || "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
