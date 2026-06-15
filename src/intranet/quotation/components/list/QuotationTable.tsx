import type { FC } from "react";
import { useState } from "react";
import {
  Table,
  TableCell,
  TableRow,
  TableBody,
} from "@/shared/components/ui/table";
import { PresupuestoEditModal } from "@/intranet/presupuestos/components/PresupuestoEditModal";
import type { Cotizacion } from "@/intranet/presupuestos/interfaces/presupuesto";
import { useQuotation } from "../../hooks/useQuotations";
import type { Quotation } from "../../interfaces/quotation";
import { quotationToCotizacion } from "../../lib/quotation-to-cotizacion";
import { QuotationTableControls } from "./QuotationTableControls";
import { QuotationTableHeader } from "./QuotationTableHeader";
import { QuotationPlaceHolder } from "./QuotationTablePlaceHolder";
import { QuotationTableRow } from "./QuotationTableRow";

export const QuotationTable: FC = () => {
  const { result, queryParams } = useQuotation();
  const { isPending, isFetching, isError, error, data } = result;
  const [selectedCotizacion, setSelectedCotizacion] = useState<Cotizacion | null>(
    null,
  );
  const [isPresupuestoOpen, setIsPresupuestoOpen] = useState(false);

  const handleOpenPresupuesto = (quotation: Quotation) => {
    setSelectedCotizacion(quotationToCotizacion(quotation));
    setIsPresupuestoOpen(true);
  };

  const handleClosePresupuesto = () => {
    setIsPresupuestoOpen(false);
    setSelectedCotizacion(null);
  };

  return (
    <>
      <QuotationTableControls>
        <Table containerClassname="flex-1 overflow-auto flex-col">
          <QuotationTableHeader />
          <TableBody>
            {isPending || isFetching ? (
              <QuotationPlaceHolder rows={queryParams.per_page ?? 5} />
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={7}>{error.message}</TableCell>
              </TableRow>
            ) : (
              <>
                {data.data.length > 0 ? (
                  data.data.map((q, i) => (
                    <QuotationTableRow
                      quotation={q}
                      key={`${q.ID}-${i}`}
                      onOpenPresupuesto={handleOpenPresupuesto}
                    />
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-8 text-gray-500"
                    >
                      No hay cotizaciones para mostrar.
                    </TableCell>
                  </TableRow>
                )}
              </>
            )}
          </TableBody>
        </Table>
      </QuotationTableControls>

      <PresupuestoEditModal
        cotizacion={selectedCotizacion}
        isOpen={isPresupuestoOpen}
        onClose={handleClosePresupuesto}
      />
    </>
  );
};
