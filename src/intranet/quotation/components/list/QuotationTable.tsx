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
import { QuotationApproveOrderDialog } from "./QuotationApproveOrderDialog";
import QuotationOrderPurchaseDialog from "./QuotationOrderPurchaseDialog";
import { getPurchaseOrderRejectionMessage } from "../../lib/quotation-workflow";
import { QuotationEditPaymentTermsDialog } from "./QuotationEditPaymentTermsDialog";

export const QuotationTable: FC = () => {
  const { result, queryParams } = useQuotation();
  const { isPending, isError, error, data } = result;
  const [selectedCotizacion, setSelectedCotizacion] = useState<Cotizacion | null>(
    null,
  );
  const [isPresupuestoOpen, setIsPresupuestoOpen] = useState(false);
  const [approveQuotation, setApproveQuotation] = useState<Quotation | null>(
    null,
  );
  const [uploadQuotationId, setUploadQuotationId] = useState<number | null>(
    null,
  );
  const [editPaymentTermsQuotation, setEditPaymentTermsQuotation] =
    useState<Quotation | null>(null);

  const uploadQuotation =
    uploadQuotationId != null
      ? (data?.data.find((q) => q.ID === uploadQuotationId) ?? null)
      : null;

  const isInitialLoading = isPending && !data;

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
            {isInitialLoading ? (
              <QuotationPlaceHolder rows={queryParams.per_page ?? 5} />
            ) : isError ? (
              <TableRow>
                <TableCell colSpan={11}>{error.message}</TableCell>
              </TableRow>
            ) : (
              <>
                {data.data.length > 0 ? (
                  data.data.map((q) => (
                    <QuotationTableRow
                      quotation={q}
                      key={q.ID}
                      viewingUnapproved={queryParams.aprobado === "NO"}
                      onOpenPresupuesto={handleOpenPresupuesto}
                      onReviewPurchaseOrder={setApproveQuotation}
                      onUploadPurchaseOrder={setUploadQuotationId}
                      onEditPaymentTerms={setEditPaymentTermsQuotation}
                    />
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={11}
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

      {approveQuotation && (
        <QuotationApproveOrderDialog
          quotation={approveQuotation}
          open={approveQuotation !== null}
          onOpenChange={(open) => {
            if (!open) {
              setApproveQuotation(null);
            }
          }}
        />
      )}

      {uploadQuotationId !== null && (
        <QuotationOrderPurchaseDialog
          quotationId={uploadQuotationId}
          rejectionMessage={
            uploadQuotation
              ? getPurchaseOrderRejectionMessage(uploadQuotation)
              : null
          }
          open={uploadQuotationId !== null}
          onOpenChange={(open) => {
            if (!open) {
              setUploadQuotationId(null);
            }
          }}
        />
      )}
      {editPaymentTermsQuotation && (
        <QuotationEditPaymentTermsDialog
          quotation={editPaymentTermsQuotation}
          open={editPaymentTermsQuotation !== null}
          onOpenChange={(open) => {
            if (!open) {
              setEditPaymentTermsQuotation(null);
            }
          }}
        />
      )}
    </>
  );
};
