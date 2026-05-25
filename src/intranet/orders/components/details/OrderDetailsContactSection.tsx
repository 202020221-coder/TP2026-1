import type { FC } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Mail, Phone } from "lucide-react";
import type { DetailedOrder } from "../../interfaces/order";

export const OrderDetailsContactSection: FC<{
  medios: DetailedOrder["medios"];
}> = ({ medios }) => {
  if (medios.length === 0) return null;

  return (
    <Card className="border shadow-none">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          Contacto
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {medios.map((medio) => (
            <div
              key={medio.id}
              className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 p-3 rounded-lg bg-muted/50"
            >
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span className="text-foreground">{medio.cliente_email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span className="text-foreground">
                  {medio.cliente_telefono}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
