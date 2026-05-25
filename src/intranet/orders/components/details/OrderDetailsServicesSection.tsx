import type { FC } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Wrench } from "lucide-react";
import type { DetailedOrder } from "../../interfaces/order";

export const OrderDetailsServicesSection: FC<{
  servicios: DetailedOrder["servicios"];
}> = ({ servicios }) => {
  if (servicios.length === 0) return null;

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
                  ID Servicio
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
              {servicios.map((servicio) => (
                <tr
                  key={servicio.id}
                  className="border-b border-border/50 last:border-0"
                >
                  <td className="py-2.5 px-3 font-medium">
                    {servicio.ID_Servicio}
                  </td>
                  <td className="py-2.5 px-3 text-muted-foreground">
                    {new Date(
                      servicio.fecha_inicio_servicio,
                    ).toLocaleDateString("es-PE", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="py-2.5 px-3 text-muted-foreground">
                    {new Date(servicio.fecha_fin_servicio).toLocaleDateString(
                      "es-PE",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      },
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-muted-foreground">
                    {servicio.horario_servicio}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
