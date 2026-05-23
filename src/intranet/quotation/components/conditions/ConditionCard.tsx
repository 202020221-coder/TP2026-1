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
} & (
  | {
      readOnly?: false;
      onEmissionChange: (v: string) => void;
      onExpirationChange: (v: string) => void;
      onConditionsChange: (v: string) => void;
    }
  | {
      readOnly?: true;
      onEmissionChange: undefined;
      onExpirationChange: undefined;
      onConditionsChange: undefined;
    }
);

export const ConditionCard: FC<ConditionCardProps> = ({
  emissionDate,
  expirationDate,
  conditions,
  readOnly = false,
  onEmissionChange,
  onExpirationChange,
  onConditionsChange,
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
            <p>Fecha de Emisión</p>
            <Input
              type="date"
              value={emissionDate}
              disabled
              onChange={(e) => onEmissionChange?.(e.target.value)}
            />
          </div>

          {/* VIGENCIA */}
          <div>
            <p>Vigencia</p>

            <Input
              type="date"
              value={expirationDate}
              disabled={readOnly}
              onChange={(e) => onExpirationChange?.(e.target.value)}
            />
          </div>

          {/* TEXTAREA */}
          <div className="sm:col-span-2 h-[20vh]">
            <Textarea
              value={conditions}
              readOnly={readOnly}
              onChange={(e) => onConditionsChange?.(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>
    </section>
  );
};
