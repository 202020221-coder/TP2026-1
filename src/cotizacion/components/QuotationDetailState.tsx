import { Button } from "@/shared/components/ui/button";

type QuotationDetailStateProps = {
  message: string;
  onBack: () => void;
};

export function QuotationDetailState({ message, onBack }: QuotationDetailStateProps) {
  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-semibold text-gray-800">Detalle de Cotizacion</h1>
      <p className="text-sm text-red-600" role="alert">{message}</p>
      <Button onClick={onBack}>Volver al listado</Button>
    </div>
  );
}