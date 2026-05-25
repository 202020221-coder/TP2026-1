import { memo, type FC } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Truck as TruckIcon } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { Badge } from "@/shared/components/ui/badge";
import type { Truck } from "@/intranet/quotation/interfaces/create/order-trucks";

interface TruckInfoCardProps {
  trucks: Truck[];
}

export const TruckInfoCard: FC<TruckInfoCardProps> = ({ trucks }) => {
  return (
    <Card className="border bg-card shadow-none">
      <CardHeader className="pb-3">
        <CardTitle className="flex flex-row items-end gap-x-1.5 mx-auto sm:mx-0">
          <TruckIcon className="text-primary" />
          <span className="pb-0.5 font-[375] text-[18px]">
            Camiones Asignados
          </span>
        </CardTitle>
        <CardDescription className="tracking-[0.5px] text-[14px] text-center sm:text-left">
          Visualice los datos de los camiones vinculados a la cotización.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {trucks.length === 0 ? (
          <div className="rounded-lg border border-border bg-muted/40 p-4 text-center text-sm text-muted-foreground">
            No hay camiones asignados.
          </div>
        ) : (
          <div className="space-y-3">
            {trucks.map((truck) => (
              <TruckCard key={truck.Placa} truck={truck} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const TruckCard: FC<{ truck: Truck }> = memo(({ truck }) => {
  const revisionDate = new Date(truck.fecha_prox_revision);
  const today = new Date();
  const daysUntilRevision = differenceInDays(revisionDate, today);
  const needsRevisionSoon = daysUntilRevision <= 30 && daysUntilRevision >= 0;

  return (
    <div className="rounded-lg border border-border bg-muted/40 p-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold tracking-tight">
              {truck.Placa}
            </span>
            <Badge variant={needsRevisionSoon ? "destructive" : "secondary"}>
              {needsRevisionSoon ? "Revisión próxima" : "Vigente"}
            </Badge>
          </div>
          <div className="text-sm text-muted-foreground">{truck.nombre}</div>
          <div className="text-sm text-muted-foreground">
            {truck.modelo} • {truck.ano_fabricacion} • {truck.color}
          </div>
          <div className="text-xs text-muted-foreground">
            Próx revisión: {format(revisionDate, "dd MMM yyyy")}
          </div>
          {truck.caracteristicas && (
            <div className="text-xs text-muted-foreground">
              {truck.caracteristicas}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
