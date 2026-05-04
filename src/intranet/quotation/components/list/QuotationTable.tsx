import type { FC } from "react";
import {
  Table,
  TableCell,
  TableRow,
  TableBody,
} from "@/shared/components/ui/table";
import { useQuotation } from "../../hooks/useQuotations";
import { QuotationTableControls } from "./QuotationTableControls";
import { QuotationTableHeader } from "./QuotationTableHeader";
import { QuotationPlaceHolder } from "./QuotationTablePlaceHolder";
import { QuotationTableRow } from "./QuotationTableRow";
export const QuotationTable: FC = () => {
  const { result, queryParams } = useQuotation();
  const { isPending, isFetching, isError, error, data } = result;
  return (
    <QuotationTableControls>
      <Table>
        <QuotationTableHeader />
        <TableBody>
          {isPending || isFetching ? (
            <QuotationPlaceHolder rows={queryParams.per_page ?? 5} />
          ) : isError ? (
            <TableRow>
              <TableCell colSpan={6}>{error.message}</TableCell>
            </TableRow>
          ) : (
            <>
              {data.data.length > 0 ? (
                data.data.map((q, i) => (
                  <QuotationTableRow quotation={q} key={`${q.ID}-${i}`} />
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
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
  );
};
