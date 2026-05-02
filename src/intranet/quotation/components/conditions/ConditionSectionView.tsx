import type { FC } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
type ConditionSectionViewProps = {
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

export const ConditionSectionView: FC<ConditionSectionViewProps> = ({
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
          <CardTitle>Condiciones Adicionales</CardTitle>
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
