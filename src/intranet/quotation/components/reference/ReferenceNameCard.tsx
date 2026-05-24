import { type FC } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { FileText } from "lucide-react";
import { useQuotationReferenceStore } from "../../hooks/stores/quotation.reference.store.provider";

export const ReferenceNameCard: FC = () => {
  const name = useQuotationReferenceStore((s) => s.name);
  const update = useQuotationReferenceStore((s) => s.update);
  return (
    <Card className="border shadow-none">
      <CardHeader>
        <CardTitle className="flex flex-row items-end gap-x-1.5 mx-auto sm:mx-0">
          <FileText className="text-primary" />
          <span className="pb-0.5 font-[375] text-[18px]">
            Nombre de Cotización
          </span>
        </CardTitle>
        <CardDescription className="tracking-[0.5px] text-[14px] text-center sm:text-left">
          Asigna un nombre descriptivo para identificar esta cotización.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Input
          value={name}
          onChange={(e) => update("name", e.target.value)}
          placeholder="Ej: Cotización de equipos médicos - Clínica San Pablo"
          className="h-10"
        />
      </CardContent>
    </Card>
  );
};
