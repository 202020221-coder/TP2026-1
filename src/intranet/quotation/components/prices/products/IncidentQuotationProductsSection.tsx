import type { FC } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { MaterialDirectoTab } from "@/intranet/presupuestos/components/tabs/MaterialDirectoTab";
import { SquareChartGantt } from "lucide-react";

interface Props {
  cotizacionId: number;
  incidentId: number;
}

/**
 * Cotizaciones de incidencia heredan líneas de gasto real en el presupuesto
 * "Material Directo", no en productos de detalles-franco.
 */
export const IncidentQuotationProductsSection: FC<Props> = ({
  cotizacionId,
  incidentId,
}) => (
  <Card className="gap-4 border bg-card shadow-none">
    <CardHeader className="pb-0">
      <CardTitle className="flex items-center gap-2 text-lg">
        <SquareChartGantt className="h-5 w-5 text-primary" />
        Productos — material directo de incidencia
      </CardTitle>
      <CardDescription>
        Objetos del gasto real del proyecto asociados a la incidencia #{incidentId}
        (diferencia gasto real − presupuestado). Se gestionan como presupuesto tipo
        Material Directo.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <MaterialDirectoTab cotizacionId={cotizacionId} />
    </CardContent>
  </Card>
);
