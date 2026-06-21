import type { FC } from "react";
import { Info } from "lucide-react";
import { TableCell } from "@/shared/components/ui/table";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import type { Quotation } from "../../interfaces/quotation";
import type { QuotationPaymentInstallment } from "../../interfaces/quotation-payment-terms";
import { useQuotationPaymentTerms } from "../../hooks/useQuotationPaymentTerms";

const isUpfrontPayment = (installment: QuotationPaymentInstallment) =>
  installment.plazo_de_pago === 0;

const formatPlazo = (installment: QuotationPaymentInstallment) =>
  isUpfrontPayment(installment)
    ? "Antes del proyecto"
    : `${installment.plazo_de_pago} días`;

export const QuotationPaymentTermsCells: FC<{
  quotationId: Quotation["ID"];
}> = ({ quotationId }) => {
  const { terms, isLoading } = useQuotationPaymentTerms(quotationId);

  if (isLoading) {
    return (
      <>
        <TableCell className="py-3">
          <Skeleton className="h-4 w-28 bg-gray-50" />
        </TableCell>
        <TableCell className="py-3">
          <Skeleton className="h-4 w-12 bg-gray-50" />
        </TableCell>
      </>
    );
  }

  const plazos = terms?.plazos_pago ?? [];

  if (plazos.length === 0) {
    return (
      <>
        <TableCell className="text-gray-400">—</TableCell>
        <TableCell className="text-gray-400">—</TableCell>
      </>
    );
  }

  const firstUpfrontInstallment = plazos.find(isUpfrontPayment);

  return (
    <>
      <TableCell className="text-gray-700">
        <div className="flex flex-col gap-1">
          {plazos.map((installment) => {
            const showConfirmationFlag =
              Boolean(terms?.requiere_confirmacion_pago_inicial) &&
              installment === firstUpfrontInstallment;

            return (
              <span
                key={installment.id ?? installment.orden}
                className="flex h-6 items-center gap-1.5"
              >
                {formatPlazo(installment)}
                {showConfirmationFlag && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="inline-flex text-amber-500">
                        <Info className="h-3.5 w-3.5" />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent
                      className="bg-white border-[1.5px] border-amber-500 text-amber-600 font-normal text-center"
                      align="center"
                    >
                      Requiere confirmación del pago inicial
                    </TooltipContent>
                  </Tooltip>
                )}
              </span>
            );
          })}
        </div>
      </TableCell>
      <TableCell className="font-medium text-gray-700">
        <div className="flex flex-col gap-1">
          {plazos.map((installment) => (
            <span
              key={installment.id ?? installment.orden}
              className="flex h-6 items-center"
            >
              {installment.porcentaje}%
            </span>
          ))}
        </div>
      </TableCell>
    </>
  );
};
