import { useOrderPickup } from "@/cotizacion/hooks/stores/orderPickupStore";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { getOrder } from "@/solicitudes/api/order.api";
import type { Order } from "@/solicitudes/interfaces/order";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Package } from "lucide-react";
import type { FC } from "react";
export const PickupSection: FC<{ orderId: Order["ID"] }> = ({ orderId }) => {
  const pickupDate = useOrderPickup((s) => s.pickupDate);
  const pickupCost = useOrderPickup((s) => s.pickupCost);
  const update = useOrderPickup((s) => s.update);
  const { isPending, error, data } = useQuery({
    queryKey: ["order"],
    queryFn: () => getOrder(orderId),
  });
  return (
    <Card className="sm:col-span-2 flex flex-col border shadow-none">
      <CardHeader>
        <CardTitle className="flex flex-row items-end gap-x-1.5 mx-auto sm:mx-0">
          <Package className="text-primary" />
          <span className="pb-0.5 font-[375] text-[18px]">
            Servicio de Recojo
          </span>
        </CardTitle>
        <CardDescription className="tracking-[0.5px] text-[14px] text-center sm:text-left">
          Establece el costo y fecha de recojo
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4 overflow-y-auto md:flex-row">
        <div className="sm:flex-3">
          <p className="font-medium text-[14px] mb-0.5">
            {"Costo de Recojo ($)"}
          </p>
          <Input
            min={0}
            type="number"
            step={0.01}
            className="h-10"
            value={pickupCost}
            onChange={(e) => update("pickupCost", Number(e.target.value))}
          />
        </div>

        <div className="sm:flex-3">
          <p className="font-medium text-[14px] mb-0.5">Fecha de Recojo</p>
          <Input
            type="date"
            className="h-10"
            value={pickupDate}
            min={format(new Date(), "yyyy-MM-dd")}
            onChange={(e) => update("pickupDate", e.target.value)}
          />
        </div>

        <div className="flex flex-col sm:flex-7">
          <p className="font-medium text-[14px] mb-0.5">
            Dirección de Entrega:
          </p>
          <p className="flex flex-1 items-center text-muted-foreground">
            {isPending ? (
              <span className="italic text-muted-foreground">
                Cargando dirección...
              </span>
            ) : error ? (
              <span className="font-medium text-destructive">
                Error al cargar dirección
              </span>
            ) : (
              <span className="text-foreground">{data.ubicacion}</span>
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
