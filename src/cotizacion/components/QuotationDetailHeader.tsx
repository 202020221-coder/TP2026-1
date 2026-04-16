import { ArrowLeft } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

type QuotationDetailHeaderProps = {
  onBack: () => void;
};

export function QuotationDetailHeader({ onBack }: QuotationDetailHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h1 className="text-2xl font-semibold text-gray-800">Detalle de Cotizacion</h1>
      <Button variant="outline" onClick={onBack}>
        <ArrowLeft className="h-4 w-4" />
        Regresar
      </Button>
    </div>
  );
}