import { type FC } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Layers } from "lucide-react";
import { useQuotationReferenceStore } from "../../hooks/stores/quotation.reference.store.provider";

interface ReferencePhasesCardProps {
  readOnly?: boolean;
}

export const ReferencePhasesCard: FC<ReferencePhasesCardProps> = ({
  readOnly = false,
}) => {
  const phases = useQuotationReferenceStore((s) => s.phases);
  const update = useQuotationReferenceStore((s) => s.update);
  return (
    <Card className="border shadow-none">
      <CardHeader>
        <CardTitle className="flex flex-row items-end gap-x-1.5 mx-auto sm:mx-0">
          <Layers className="text-primary" />
          <span className="pb-0.5 font-[375] text-[18px]">
            Fases de la Cotización
          </span>
        </CardTitle>
        <CardDescription className="tracking-[0.5px] text-[14px] text-center sm:text-left">
          {readOnly
            ? "Información de fases de la cotización."
            : "Define la cantidad de fases y la duración de cada una para esta cotización."}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-row gap-4">
        <div className="flex-1 space-y-2">
          <label className="text-sm font-medium text-foreground">
            Cantidad de Fases
          </label>
          {readOnly ? (
            <p className="text-sm font-semibold text-foreground h-10 flex items-center">
              {phases.quantity}
            </p>
          ) : (
            <Input
              type="number"
              min={1}
              step={1}
              value={phases.quantity}
              onChange={(e) =>
                update("phases", {
                  ...phases,
                  quantity: Number(e.target.value),
                })
              }
              placeholder="Ej: 3"
              className="h-10"
            />
          )}
        </div>
        <div className="flex-1 space-y-2">
          <label className="text-sm font-medium text-foreground">
            Duración por Fase (días)
          </label>
          {readOnly ? (
            <p className="text-sm font-semibold text-foreground h-10 flex items-center">
              {phases.duration}
            </p>
          ) : (
            <Input
              type="number"
              min={1}
              step={1}
              value={phases.duration}
              onChange={(e) =>
                update("phases", {
                  ...phases,
                  duration: Number(e.target.value),
                })
              }
              placeholder="Ej: 30"
              className="h-10"
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};
