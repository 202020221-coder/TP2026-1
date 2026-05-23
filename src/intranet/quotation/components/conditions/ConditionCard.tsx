import type { FC } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { ClipboardList } from "lucide-react";
type ConditionCardProps = {
  emissionDate: string;
  expirationDate: string;
  conditions: string;
  observaciones: string;
} & (
  | {
      readOnly?: false;
      onEmissionChange: (v: string) => void;
      onExpirationChange: (v: string) => void;
      onConditionsChange: (v: string) => void;
      onObservacionesChange: (v: string) => void;
    }
  | {
      readOnly?: true;
      onEmissionChange: undefined;
      onExpirationChange: undefined;
      onConditionsChange: undefined;
      onObservacionesChange: undefined;
    }
);

export const ConditionCard: FC<ConditionCardProps> = ({
  emissionDate,
  expirationDate,
  conditions,
  observaciones,
  readOnly = false,
  onEmissionChange,
  onExpirationChange,
  onConditionsChange,
  onObservacionesChange,
}) => {
  return (
    <section className="h-full flex flex-col justify-between">
      <Card className="flex h-full shadow-none">
        <CardHeader>
          <CardTitle className="flex flex-row items-end gap-x-1.5 mx-auto sm:mx-0">
            <ClipboardList className="text-primary" />
            <span className="pb-0.5 font-[375] text-[18px]">
              Condiciones Adicionales
            </span>
          </CardTitle>
          <CardDescription className="tracking-[0.5px] text-[14px] text-center sm:text-left">
            Configura los plazos y condiciones generales para la cotización.
          </CardDescription>
        </CardHeader>

        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* EMISION */}
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Fecha de Emisión
            </p>
            <Input
              type="date"
              value={emissionDate}
              disabled
              onChange={(e) => onEmissionChange?.(e.target.value)}
              readOnly={readOnly}
            />
          </div>

          {/* VIGENCIA */}
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Fecha de Vigencia
            </p>
            <Input
              type="date"
              value={expirationDate}
              disabled={readOnly}
              onChange={(e) => onExpirationChange?.(e.target.value)}
              readOnly={readOnly}
            />
          </div>

          {/* CONDICIONES */}
          <div className="sm:col-span-2">
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Condiciones
            </p>
            <Textarea
              className="min-h-[20vh]"
              value={conditions}
              readOnly={readOnly}
              onChange={(e) => onConditionsChange?.(e.target.value)}
              disabled={readOnly}
            />
          </div>

          {/* OBSERVACIONES */}
          <div className="sm:col-span-2">
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Observaciones
            </p>
            <Textarea
              className="min-h-[15vh]"
              value={observaciones}
              readOnly={readOnly}
              placeholder="Notas adicionales para la cotización..."
              onChange={(e) => onObservacionesChange?.(e.target.value)}
              disabled={readOnly}
            />
          </div>
        </CardContent>
      </Card>
    </section>
  );
};
